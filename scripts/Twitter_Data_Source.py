# -*- coding: utf-8 -*-
"""
Data source for Cloud Computing Project

@author: John DAngelo
"""
import tweepy
import pandas as pd

# Filenames
keyFileName = "twitter_api_keys.txt"
outFileName = "twitter_out.txt"
# Scraping filters
username = "john"
no_of_tweets = 100

# Get the API keys from the key file
with open(keyFileName, "r") as key_file:
    # Stored in order as APIKey, APISecret, accessToken, accessSecret, bearerToken (not needed)
    APIKey = key_file.readline().strip()
    APISecret = key_file.readline().strip()
    accessToken = key_file.readline().strip()
    accessSecret = key_file.readline().strip()

# Pass in the Twitter authentication keys
auth = tweepy.OAuth1UserHandler(APIKey, APISecret, accessToken, accessSecret)

# Instantiate the tweepy API
api = tweepy.API(auth, wait_on_rate_limit=True)

try:
    # Get the tweets according to our filters (from 'username', count of tweets)
    tweets = api.user_timeline(screen_name=username, count=no_of_tweets)
    
    # Get specific attrubutes from the tweets (date, likes, source, content)
    attributes_container = [[tweet.created_at, tweet.favorite_count,tweet.source,  tweet.text] for tweet in tweets]

    # Names of the columns in the dataframe
    columns = ["Date Created", "Number of Likes", "Source of Tweet", "Tweet"]
    
    # Create the dataframe
    tweets_df = pd.DataFrame(attributes_container, columns=columns)
except BaseException as e:
    print('Status Failed On,',str(e))
    
# Basic info about returned data
print(tweets_df.info())
print(tweets_df.head)
print(tweets_df.iloc[0:5, 3])

# Output data to desired location
tweets_df["Tweet"].to_csv(outFileName, index=False)

with open(outFileName, "w") as out_file:
    # First 5 rows of the 3rd column (Tweet content)
    out_file.write(tweets_df.iloc[0:5, 3])

