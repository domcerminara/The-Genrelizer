Dominic Cerminara- dcermina
Sachin Hegde- shegde
Nikhil Joshi- nikhilj

Our project uses the last.fm API to get search results relevant to whichever artist the user enters. It will return the top five tracks for the genre as well as the top six artists in the genre for the current week. The Genrelizer also returns the popularity of the top artists for the current week. 

Note: Last.fm sometimes returns empty objects (such as for the artist 'asdasd', among others). In this case, we just return without manipulating the DOM or displaying the results, since the objects are fully formed but contain meaningless data. 