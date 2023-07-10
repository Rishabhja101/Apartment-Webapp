from flask import Flask, render_template, request, redirect, url_for
import json

import sys
sys.path.insert(0, '../my_venmo_api')
from Venmo import Venmo
from tokens import venmo_access_token

app = Flask(__name__)
venmo = Venmo(venmo_access_token)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/payments')
def payments():
    # Load existing payments from a JSON file or database
    with open('payments.json') as file:
        payments = json.load(file)
    return render_template('payments.html', payments=payments)

@app.route('/payments/add', methods=['GET', 'POST'])
def add_payment():
    if request.method == 'POST':
        friend = json.loads(request.form['friend'].replace("'", '"'))
        amount = request.form['amount']
        direction = request.form['direction']
        frequency = request.form['frequency']

        # Load existing payments from a JSON file or database
        with open('payments.json') as file:
            payments = json.load(file)

        # Add the new payment to the list
        new_payment = {
            'friend': {
                        'first_name': friend['first_name'],
                        'last_name': friend['last_name'],
                        'username': friend['username'],
                        'id': friend['id'],
                        'image_url': friend['image_url']
                        },
            'amount': amount,
            'direction': direction,
            'frequency': frequency
        }
        payments.append(new_payment)

        # Save the updated list back to the JSON file
        with open('payments.json', 'w') as file:
            json.dump(payments, file, indent=4)

        return redirect(url_for('payments'))

    # Load existing friends from a JSON file or database
    with open('friends.json') as file:
        friends = json.load(file)

    return render_template('add_payment.html', friends=friends)

# Route for adding a new friend
@app.route('/friends/add', methods=['GET', 'POST'])
def add_friend():
    if request.method == 'POST':
        new_friend = request.json['new_friend']

        # Load existing friends from a JSON file
        with open('friends.json') as file:
            friends = json.load(file)
        friends.append(new_friend)

        # Save the updated list back to the JSON file
        with open('friends.json', 'w') as file:
            json.dump(friends, file, indent=4)

        return redirect(url_for('view_friends'))

    return render_template('add_friend.html')
    

@app.route('/friends/search', methods=['POST'])
def search_friends():
    search_term = request.json['search']
    # Perform search logic based on the search term
    # Return a list of matching friend names as JSON response
    # Example: ['John Doe', 'Jane Smith']
    print(request.json['search'])
    print(search_term)
    results = venmo.get_user(search_term)
    print(results)
    print('--------')
    print(results[0])
    return json.dumps(results)

# Route for viewing friends
@app.route('/friends')
def view_friends():
    with open('friends.json') as file:
        friends = json.load(file)
    return render_template('view_friends.html', friends=friends)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)