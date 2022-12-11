from time import sleep
from facebook_scraper import get_posts
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
def emitPostsFacebook(postsRequested,send):
    
	postsPerPage = int(postsRequested / 3)
 
	postsEmitted = 0;
    
	for post in get_posts('nintendo', pages=4, options={"posts_per_page": postsPerPage, "comments":True}):
		try:
			comments = post['comments_full']
			for comment in comments:
				if(postsEmitted == postsRequested):
					#emit the end of data token
					return
				splitcomm = comment['comment_text'].splitlines()
				try:
					#Perform a function on each comment with .5 sec intervals between
					send(splitcomm[0])
    
					postsEmitted+=1
					sleep(0.5)
				except:
					postsEmitted+=1
					print("FAIL")
				
		except:
			print("empty")
	send(endOfData)
   
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

# parseArgs parses command line args passed in as described above
def parseArgs(args,send):
    postsToSend = 10
    websiteToUse = '-f'
    
    if(len(args)>2):
        for arg in args:
            if(arg != args[1]):
                try:
                    postsToSend = int(arg)
                except:
                    if(arg[0] == '-'):
                        websiteToUse = arg
    #start the appropriate function
    if(websiteToUse == "-f"):
        emitPostsFacebook(postsToSend,send)
    if(websiteToUse == "-t"):
        emitPostsTwitter(postsToSend,send)
    
#if we implement parameter passing, add args here
def container_main(data, send,args):
    parseArgs(args,send)