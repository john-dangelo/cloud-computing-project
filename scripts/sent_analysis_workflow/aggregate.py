
totalScores = {"positive":0,"neutral":0,"negative":0,"cumulative":0}
numberOfPosts = 0
averageScores ={"positive":0,"neutral":0,"negative":0}


def container_main(data,send):
    post = data['post']
    score = data['scores']
    
    global numberOfPosts;
    global totalScores;
    global averageScores;
    
    numberOfPosts = numberOfPosts + 1
    
    totalScores.update({"positive": totalScores['positive'] + score['pos']})
    totalScores.update({"negative": totalScores['negative'] + score['neg']})
    totalScores.update({"neutral": totalScores['neutral'] + score['neu']})
    totalScores.update({"cumulative": totalScores['cumulative'] + score['compound']})
    
    averageScores.update({"positive": totalScores['positive'] / numberOfPosts})
    averageScores.update({"negative": totalScores['negative'] / numberOfPosts})
    averageScores.update({"neutral": totalScores['neutral'] / numberOfPosts})
    averageScores.update({"cumulative": totalScores['cumulative'] / numberOfPosts})
    
    returnPack = {
        "Total Posts Processed": numberOfPosts,
        "Aggregate Scores": totalScores,
        "Average Scores":averageScores
    }
    
    send(returnPack)
    
    
    