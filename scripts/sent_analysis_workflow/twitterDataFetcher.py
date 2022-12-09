from time import sleep
import snscrape.modules.twitter as sntwitter

######################################
#Command line args (accepts one to three)
#the first is always the jobId of the workflow
#the second is -t or -f for twitter or facebook
#the third is an integer for the number of posts
#
#Default for the second arg is facebook
#Default for the third arg is 10
######################################


endOfData = "~~EOD~~"

########## Data Emission. Call func you want with # of posts you want #########
   
def emitPostsTwitter(postsRequested,send):
    for i,tweet in enumerate(sntwitter.TwitterSearchScraper('#nintendo since:2021-06-01 until:2022-10-10').get_items()):
        if i>postsRequested:
            #emit the end of data token
            break
        splitTweet = tweet.content.split("http");
        tweetContent = splitTweet[0]
        #Perform a function on each tweet with .5 sec intervals between
        send(tweetContent)
        sleep(0.5)
    send(endOfData)
        
##################### Data emission above ###########################
    
#if we implement parameter passing, add args here
def container_main(data, send):
    emitPostsTwitter(120,send)