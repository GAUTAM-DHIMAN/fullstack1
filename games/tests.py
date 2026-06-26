from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Publisher, Game


class GameKeyPlatformTests(APITestCase):

    def test_user_registration(self):
        """Test user registration endpoint returns a token."""
        url = '/api/register/'
        data = {'username': 'testpublisher', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        
        # Verify user and token were created
        self.assertTrue(User.objects.filter(username='testpublisher').exists())
        user = User.objects.get(username='testpublisher')
        self.assertTrue(Token.objects.filter(user=user).exists())

    def test_unauthenticated_creation_blocked(self):
        """Test unauthenticated writes to games are blocked."""
        url = '/api/games/'
        data = {'title': 'Minecraft', 'price': '19.99'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_game_creation(self):
        """Test authenticated publisher can create a game."""
        # 1. Register and get token
        user = User.objects.create_user(username='publisher_user', password='password123')
        token = Token.objects.create(user=user)
        
        # 2. Create publisher profile
        publisher = Publisher.objects.create(
            name="Mojang",
            webhook_url="https://mojang.com/webhook",
            webhook_secret="abc123secret",
            user=user
        )
        
        # Authenticate client
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        # 3. Create game
        url = '/api/games/'
        data = {'title': 'Minecraft', 'price': '19.99', 'publisher': publisher.id}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Game.objects.count(), 1)
        self.assertEqual(Game.objects.get().title, 'Minecraft')

    def test_custom_object_level_permissions(self):
        """Test that a publisher cannot modify another publisher's games."""
        # Publisher A setup
        user_a = User.objects.create_user(username='user_a', password='password123')
        token_a = Token.objects.create(user=user_a)
        pub_a = Publisher.objects.create(
            name="Pub A", webhook_url="https://puba.com", webhook_secret="secretA", user=user_a
        )
        game_a = Game.objects.create(title="Game A", publisher=pub_a, price="9.99")

        # Publisher B setup
        user_b = User.objects.create_user(username='user_b', password='password123')
        token_b = Token.objects.create(user=user_b)
        pub_b = Publisher.objects.create(
            name="Pub B", webhook_url="https://pubb.com", webhook_secret="secretB", user=user_b
        )

        # Authenticate client as Publisher B
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_b.key)

        # Publisher B tries to modify Publisher A's game
        url = f'/api/games/{game_a.id}/'
        data = {'title': 'Hacked Game', 'price': '0.99', 'publisher': pub_a.id}
        response = self.client.put(url, data, format='json')
        
        # Verify access is forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Authenticate client as Publisher A
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_a.key)
        response_a = self.client.put(url, data, format='json')
        
        # Verify modification is successful
        self.assertEqual(response_a.status_code, status.HTTP_200_OK)
        game_a.refresh_from_db()
        self.assertEqual(game_a.title, 'Hacked Game')

