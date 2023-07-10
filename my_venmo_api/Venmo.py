from venmo_api import Client

class Venmo:
    def get_access_token(username, password):
        return Client.get_access_token(username=username, password=password)

    def __init__(self, access_token):
        self.access_token = access_token
        self.client = Client(access_token=access_token)

    def revoke_access_token(self):
        self.client.log_out("Bearer " + self.access_token)

    def get_user(self, search_term):
        users_raw = self.client.user.search_for_users(query=search_term)
        users = []
        for user_raw in users_raw:
            user = {'first_name': user_raw.first_name,
                    'last_name': user_raw.last_name,
                    'username': user_raw.username,
                    'id': user_raw.id,
                    'image_url': user_raw.profile_picture_url}
            users.append(user)
        return users

    def request_money(self, id, amount, reason):
        self.client.payment.request_money(amount, reason, id)

    def send_money(self, id, amount, reason):
        self.client.payment.send_money(amount, reason, id)
