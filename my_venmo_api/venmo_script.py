from Venmo import Venmo
from tokens import venmo_access_token


venmo = Venmo(venmo_access_token)

user_ids = {'Chirag_Kikkeri': 2816651993022464747,
            'Raj_Pulugurtha': 2799084612091904688,
            'Sasin_Gudipati': 2384567184916480650,
            'Tyler_Gall': 2726616903974912480,
            'Shouri_Addepally': 2923213252198400936}

# Request $5 for YouTube Premium every month
for id in user_ids:
    venmo.request_money(user_ids[id], 420.69, "shab's automated venmo request (this is a test run, go ahead and decline the request unless you would like to send me free money)")