#Credit for the sentiment analysis library goes entirely to the natural language tool kit(nltk) https://www.nltk.org/
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

def container_main(data,send):
	sia = SentimentIntensityAnalyzer()
	scores = sia.polarity_scores(data)
	final_data={"post":data,"scores":scores}
	send(final_data)
	


