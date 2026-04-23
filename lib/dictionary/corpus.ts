import type { DictionaryEntry } from '@/types/dictionary';

const SEED_WORDS: DictionaryEntry[] = [
  { word: 'algorithm', definition: 'A step-by-step process for solving a problem.', partOfSpeech: 'noun' },
  { word: 'array', definition: 'An ordered collection of values.', partOfSpeech: 'noun' },
  { word: 'binary', definition: 'Relating to base-2 representation using 0 and 1.', partOfSpeech: 'adjective' },
  { word: 'cache', definition: 'A storage layer used to speed up data access.', partOfSpeech: 'noun' },
  { word: 'cat', definition: 'A small domesticated carnivorous mammal.', partOfSpeech: 'noun' },
  { word: 'code', definition: 'Instructions written in a programming language.', partOfSpeech: 'noun' },
  { word: 'compile', definition: 'To transform source code into executable form.', partOfSpeech: 'verb' },
  { word: 'context', definition: 'Relevant surrounding information for interpretation.', partOfSpeech: 'noun' },
  { word: 'cot', definition: 'A small portable bed.', partOfSpeech: 'noun' },
  { word: 'cut', definition: 'To divide something with a sharp-edged tool.', partOfSpeech: 'verb' },
  { word: 'data', definition: 'Facts and statistics collected for reference.', partOfSpeech: 'noun' },
  { word: 'debug', definition: 'To identify and fix software defects.', partOfSpeech: 'verb' },
  { word: 'deploy', definition: 'To release software to users.', partOfSpeech: 'verb' },
  { word: 'dictionary', definition: 'A reference listing words and their meanings.', partOfSpeech: 'noun' },
  { word: 'dog', definition: 'A domesticated carnivorous mammal kept as a pet or for work.', partOfSpeech: 'noun' },
  { word: 'enqueue', definition: 'To add an element to the end of a queue.', partOfSpeech: 'verb' },
  { word: 'framework', definition: 'A reusable structure for software development.', partOfSpeech: 'noun' },
  { word: 'graph', definition: 'A data structure made of nodes and edges.', partOfSpeech: 'noun' },
  { word: 'hash', definition: 'A computed value used to identify data quickly.', partOfSpeech: 'noun' },
  { word: 'index', definition: 'A structure that optimizes lookup operations.', partOfSpeech: 'noun' },
  { word: 'iterate', definition: 'To repeat a sequence of steps.', partOfSpeech: 'verb' },
  { word: 'json', definition: 'A lightweight format for structured data exchange.', partOfSpeech: 'noun' },
  { word: 'latency', definition: 'Delay between request and response.', partOfSpeech: 'noun' },
  { word: 'memoize', definition: 'To cache function outputs for repeated inputs.', partOfSpeech: 'verb' },
  { word: 'node', definition: 'A point in a data structure or network.', partOfSpeech: 'noun' },
  { word: 'optimize', definition: 'To make a system as effective as possible.', partOfSpeech: 'verb' },
  { word: 'queue', definition: 'A first-in, first-out data structure.', partOfSpeech: 'noun' },
  { word: 'react', definition: 'A JavaScript library for building user interfaces.', partOfSpeech: 'noun' },
  { word: 'reduce', definition: 'To combine values into a single accumulated result.', partOfSpeech: 'verb' },
  { word: 'state', definition: 'Current data describing application behavior.', partOfSpeech: 'noun' },
  { word: 'trie', definition: 'A tree-like structure for efficient prefix lookup.', partOfSpeech: 'noun' },
];

const COMMON_WORDS: DictionaryEntry[] = [
  { word: 'about', definition: 'On the subject of; concerning.', partOfSpeech: 'preposition' },
  { word: 'above', definition: 'At a higher level than something else.', partOfSpeech: 'preposition' },
  { word: 'after', definition: 'Later in time than.', partOfSpeech: 'preposition' },
  { word: 'again', definition: 'One more time.', partOfSpeech: 'adverb' },
  { word: 'air', definition: 'The invisible gas we breathe.', partOfSpeech: 'noun' },
  { word: 'all', definition: 'Every one or thing.', partOfSpeech: 'pronoun' },
  { word: 'always', definition: 'At all times.', partOfSpeech: 'adverb' },
  { word: 'animal', definition: 'A living thing that is not a plant.', partOfSpeech: 'noun' },
  { word: 'answer', definition: 'A response to a question.', partOfSpeech: 'noun' },
  { word: 'apple', definition: 'A round fruit with red, green, or yellow skin.', partOfSpeech: 'noun' },
  { word: 'around', definition: 'On every side of; surrounding.', partOfSpeech: 'preposition' },
  { word: 'ask', definition: 'To request information.', partOfSpeech: 'verb' },
  { word: 'baby', definition: 'A very young child.', partOfSpeech: 'noun' },
  { word: 'back', definition: 'The rear part of something.', partOfSpeech: 'noun' },
  { word: 'bad', definition: 'Not good.', partOfSpeech: 'adjective' },
  { word: 'bag', definition: 'A soft container used for carrying things.', partOfSpeech: 'noun' },
  { word: 'ball', definition: 'A round object used in games.', partOfSpeech: 'noun' },
  { word: 'banana', definition: 'A long curved yellow fruit.', partOfSpeech: 'noun' },
  { word: 'bed', definition: 'A piece of furniture used for sleeping.', partOfSpeech: 'noun' },
  { word: 'before', definition: 'Earlier than.', partOfSpeech: 'preposition' },
  { word: 'begin', definition: 'To start something.', partOfSpeech: 'verb' },
  { word: 'best', definition: 'Of the highest quality.', partOfSpeech: 'adjective' },
  { word: 'better', definition: 'Of higher quality than another.', partOfSpeech: 'adjective' },
  { word: 'big', definition: 'Large in size.', partOfSpeech: 'adjective' },
  { word: 'bird', definition: 'A warm-blooded egg-laying animal with feathers.', partOfSpeech: 'noun' },
  { word: 'black', definition: 'The darkest color.', partOfSpeech: 'adjective' },
  { word: 'blue', definition: 'A color like the sky.', partOfSpeech: 'adjective' },
  { word: 'book', definition: 'A set of written or printed pages bound together.', partOfSpeech: 'noun' },
  { word: 'both', definition: 'The two together.', partOfSpeech: 'pronoun' },
  { word: 'box', definition: 'A container with flat sides.', partOfSpeech: 'noun' },
  { word: 'boy', definition: 'A male child.', partOfSpeech: 'noun' },
  { word: 'bread', definition: 'Food made from flour and water.', partOfSpeech: 'noun' },
  { word: 'bring', definition: 'To carry something to a place.', partOfSpeech: 'verb' },
  { word: 'brother', definition: 'A male sibling.', partOfSpeech: 'noun' },
  { word: 'build', definition: 'To make something by putting parts together.', partOfSpeech: 'verb' },
  { word: 'buy', definition: 'To get something by paying money.', partOfSpeech: 'verb' },
  { word: 'call', definition: 'To speak to someone by phone or shout to them.', partOfSpeech: 'verb' },
  { word: 'car', definition: 'A road vehicle with an engine.', partOfSpeech: 'noun' },
  { word: 'care', definition: 'Serious attention or concern.', partOfSpeech: 'noun' },
  { word: 'cat', definition: 'A small domesticated carnivorous mammal.', partOfSpeech: 'noun' },
  { word: 'chair', definition: 'A seat for one person with a back.', partOfSpeech: 'noun' },
  { word: 'change', definition: 'To make or become different.', partOfSpeech: 'verb' },
  { word: 'child', definition: 'A young human being.', partOfSpeech: 'noun' },
  { word: 'clean', definition: 'Free from dirt.', partOfSpeech: 'adjective' },
  { word: 'close', definition: 'To shut something.', partOfSpeech: 'verb' },
  { word: 'cloud', definition: 'A visible mass of water drops in the sky.', partOfSpeech: 'noun' },
  { word: 'cold', definition: 'Having a low temperature.', partOfSpeech: 'adjective' },
  { word: 'color', definition: 'The quality of an object related to light.', partOfSpeech: 'noun' },
  { word: 'come', definition: 'To move toward a place or person.', partOfSpeech: 'verb' },
  { word: 'cook', definition: 'To prepare food by heating it.', partOfSpeech: 'verb' },
  { word: 'cool', definition: 'Slightly cold in a pleasant way.', partOfSpeech: 'adjective' },
  { word: 'dance', definition: 'To move rhythmically to music.', partOfSpeech: 'verb' },
  { word: 'day', definition: 'A 24-hour period.', partOfSpeech: 'noun' },
  { word: 'deep', definition: 'Extending far down from the top.', partOfSpeech: 'adjective' },
  { word: 'do', definition: 'To perform an action.', partOfSpeech: 'verb' },
  { word: 'door', definition: 'A movable barrier used to open or close an entrance.', partOfSpeech: 'noun' },
  { word: 'down', definition: 'Toward a lower position.', partOfSpeech: 'adverb' },
  { word: 'draw', definition: 'To make a picture with lines.', partOfSpeech: 'verb' },
  { word: 'drink', definition: 'To take liquid into the mouth and swallow.', partOfSpeech: 'verb' },
  { word: 'dry', definition: 'Not wet.', partOfSpeech: 'adjective' },
  { word: 'eat', definition: 'To put food into the mouth and swallow it.', partOfSpeech: 'verb' },
  { word: 'egg', definition: 'An oval object laid by birds and some animals.', partOfSpeech: 'noun' },
  { word: 'end', definition: 'The final part of something.', partOfSpeech: 'noun' },
  { word: 'even', definition: 'Flat and level.', partOfSpeech: 'adjective' },
  { word: 'every', definition: 'Used to refer to all members of a group.', partOfSpeech: 'adjective' },
  { word: 'eye', definition: 'The organ used for seeing.', partOfSpeech: 'noun' },
  { word: 'face', definition: 'The front part of a person’s head.', partOfSpeech: 'noun' },
  { word: 'family', definition: 'A group of related people.', partOfSpeech: 'noun' },
  { word: 'far', definition: 'At a great distance.', partOfSpeech: 'adverb' },
  { word: 'fast', definition: 'Moving quickly.', partOfSpeech: 'adjective' },
  { word: 'father', definition: 'A male parent.', partOfSpeech: 'noun' },
  { word: 'feel', definition: 'To experience an emotion or sensation.', partOfSpeech: 'verb' },
  { word: 'find', definition: 'To discover by searching.', partOfSpeech: 'verb' },
  { word: 'fire', definition: 'Heat and light from burning.', partOfSpeech: 'noun' },
  { word: 'fish', definition: 'An animal that lives in water and has gills.', partOfSpeech: 'noun' },
  { word: 'floor', definition: 'The lower surface of a room.', partOfSpeech: 'noun' },
  { word: 'flower', definition: 'The bloom of a plant.', partOfSpeech: 'noun' },
  { word: 'food', definition: 'Substances eaten for nutrition.', partOfSpeech: 'noun' },
  { word: 'friend', definition: 'A person you know well and like.', partOfSpeech: 'noun' },
  { word: 'full', definition: 'Containing as much as possible.', partOfSpeech: 'adjective' },
  { word: 'game', definition: 'An activity played for fun or competition.', partOfSpeech: 'noun' },
  { word: 'garden', definition: 'A piece of ground used for growing plants.', partOfSpeech: 'noun' },
  { word: 'girl', definition: 'A female child.', partOfSpeech: 'noun' },
  { word: 'give', definition: 'To hand something to someone.', partOfSpeech: 'verb' },
  { word: 'go', definition: 'To move from one place to another.', partOfSpeech: 'verb' },
  { word: 'good', definition: 'Of high quality; pleasant.', partOfSpeech: 'adjective' },
  { word: 'green', definition: 'A color between blue and yellow.', partOfSpeech: 'adjective' },
  { word: 'group', definition: 'A number of people or things together.', partOfSpeech: 'noun' },
  { word: 'grow', definition: 'To increase in size or develop.', partOfSpeech: 'verb' },
  { word: 'happy', definition: 'Feeling pleasure or contentment.', partOfSpeech: 'adjective' },
  { word: 'hard', definition: 'Solid, firm, or difficult.', partOfSpeech: 'adjective' },
  { word: 'have', definition: 'To possess or own.', partOfSpeech: 'verb' },
  { word: 'head', definition: 'The upper part of the human body.', partOfSpeech: 'noun' },
  { word: 'hear', definition: 'To perceive sound.', partOfSpeech: 'verb' },
  { word: 'help', definition: 'To make it easier for someone to do something.', partOfSpeech: 'verb' },
  { word: 'home', definition: 'The place where someone lives.', partOfSpeech: 'noun' },
  { word: 'hot', definition: 'Having a high temperature.', partOfSpeech: 'adjective' },
  { word: 'house', definition: 'A building where people live.', partOfSpeech: 'noun' },
  { word: 'jump', definition: 'To push off the ground and rise quickly.', partOfSpeech: 'verb' },
  { word: 'keep', definition: 'To continue having or holding.', partOfSpeech: 'verb' },
  { word: 'key', definition: 'A small object used to open locks.', partOfSpeech: 'noun' },
  { word: 'kind', definition: 'Friendly and considerate.', partOfSpeech: 'adjective' },
  { word: 'kitchen', definition: 'A room where food is prepared.', partOfSpeech: 'noun' },
  { word: 'know', definition: 'To be aware of through experience or learning.', partOfSpeech: 'verb' },
  { word: 'lake', definition: 'A large body of water surrounded by land.', partOfSpeech: 'noun' },
  { word: 'land', definition: 'The part of Earth not covered by water.', partOfSpeech: 'noun' },
  { word: 'large', definition: 'Big in size.', partOfSpeech: 'adjective' },
  { word: 'last', definition: 'Coming after all others.', partOfSpeech: 'adjective' },
  { word: 'late', definition: 'After the expected time.', partOfSpeech: 'adjective' },
  { word: 'laugh', definition: 'To make sounds of amusement.', partOfSpeech: 'verb' },
  { word: 'learn', definition: 'To gain knowledge or skill.', partOfSpeech: 'verb' },
  { word: 'leave', definition: 'To go away from a place.', partOfSpeech: 'verb' },
  { word: 'left', definition: 'The side opposite right.', partOfSpeech: 'noun' },
  { word: 'light', definition: 'Brightness that lets you see.', partOfSpeech: 'noun' },
  { word: 'line', definition: 'A long narrow mark.', partOfSpeech: 'noun' },
  { word: 'listen', definition: 'To pay attention to sound.', partOfSpeech: 'verb' },
  { word: 'little', definition: 'Small in size or amount.', partOfSpeech: 'adjective' },
  { word: 'live', definition: 'To be alive; to reside somewhere.', partOfSpeech: 'verb' },
  { word: 'long', definition: 'Having great length.', partOfSpeech: 'adjective' },
  { word: 'look', definition: 'To direct your eyes toward something.', partOfSpeech: 'verb' },
  { word: 'love', definition: 'A deep feeling of affection.', partOfSpeech: 'noun' },
  { word: 'make', definition: 'To create or produce something.', partOfSpeech: 'verb' },
  { word: 'man', definition: 'An adult male human.', partOfSpeech: 'noun' },
  { word: 'many', definition: 'A large number of.', partOfSpeech: 'adjective' },
  { word: 'milk', definition: 'A white liquid from mammals, used as food.', partOfSpeech: 'noun' },
  { word: 'money', definition: 'A medium of exchange for goods and services.', partOfSpeech: 'noun' },
  { word: 'moon', definition: 'The natural satellite of Earth.', partOfSpeech: 'noun' },
  { word: 'mother', definition: 'A female parent.', partOfSpeech: 'noun' },
  { word: 'mountain', definition: 'A very high hill.', partOfSpeech: 'noun' },
  { word: 'move', definition: 'To change position or place.', partOfSpeech: 'verb' },
  { word: 'music', definition: 'Organized sound that is pleasant to hear.', partOfSpeech: 'noun' },
  { word: 'name', definition: 'A word by which someone or something is known.', partOfSpeech: 'noun' },
  { word: 'near', definition: 'At a short distance from.', partOfSpeech: 'preposition' },
  { word: 'need', definition: 'To require something because it is essential.', partOfSpeech: 'verb' },
  { word: 'new', definition: 'Recently made or discovered.', partOfSpeech: 'adjective' },
  { word: 'night', definition: 'The period of darkness each day.', partOfSpeech: 'noun' },
  { word: 'noise', definition: 'A sound, especially an unwanted one.', partOfSpeech: 'noun' },
  { word: 'north', definition: 'The direction opposite south.', partOfSpeech: 'noun' },
  { word: 'open', definition: 'Not closed.', partOfSpeech: 'adjective' },
  { word: 'orange', definition: 'A round citrus fruit or its color.', partOfSpeech: 'noun' },
  { word: 'outside', definition: 'The external side or surface.', partOfSpeech: 'noun' },
  { word: 'paper', definition: 'Material used for writing and printing.', partOfSpeech: 'noun' },
  { word: 'park', definition: 'A public green area for recreation.', partOfSpeech: 'noun' },
  { word: 'party', definition: 'A social gathering of invited guests.', partOfSpeech: 'noun' },
  { word: 'people', definition: 'Human beings in general.', partOfSpeech: 'noun' },
  { word: 'phone', definition: 'A device used for voice communication.', partOfSpeech: 'noun' },
  { word: 'picture', definition: 'An image made by drawing, painting, or photography.', partOfSpeech: 'noun' },
  { word: 'place', definition: 'A particular position or area.', partOfSpeech: 'noun' },
  { word: 'play', definition: 'To engage in activity for enjoyment.', partOfSpeech: 'verb' },
  { word: 'quick', definition: 'Fast; done with speed.', partOfSpeech: 'adjective' },
  { word: 'quiet', definition: 'Making little or no noise.', partOfSpeech: 'adjective' },
  { word: 'rain', definition: 'Water falling from clouds.', partOfSpeech: 'noun' },
  { word: 'read', definition: 'To look at and understand written words.', partOfSpeech: 'verb' },
  { word: 'red', definition: 'A color at the end of the visible spectrum.', partOfSpeech: 'adjective' },
  { word: 'right', definition: 'The side opposite left.', partOfSpeech: 'noun' },
  { word: 'river', definition: 'A natural stream of water.', partOfSpeech: 'noun' },
  { word: 'road', definition: 'A path for vehicles and people.', partOfSpeech: 'noun' },
  { word: 'room', definition: 'A part of a building enclosed by walls.', partOfSpeech: 'noun' },
  { word: 'run', definition: 'To move quickly on foot.', partOfSpeech: 'verb' },
  { word: 'same', definition: 'Identical; not different.', partOfSpeech: 'adjective' },
  { word: 'school', definition: 'A place where children are taught.', partOfSpeech: 'noun' },
  { word: 'sea', definition: 'A large body of salt water.', partOfSpeech: 'noun' },
  { word: 'see', definition: 'To perceive with the eyes.', partOfSpeech: 'verb' },
  { word: 'sell', definition: 'To exchange something for money.', partOfSpeech: 'verb' },
  { word: 'short', definition: 'Having little length or height.', partOfSpeech: 'adjective' },
  { word: 'show', definition: 'To allow something to be seen.', partOfSpeech: 'verb' },
  { word: 'sing', definition: 'To make musical sounds with the voice.', partOfSpeech: 'verb' },
  { word: 'sister', definition: 'A female sibling.', partOfSpeech: 'noun' },
  { word: 'sit', definition: 'To rest with your body supported by your bottom.', partOfSpeech: 'verb' },
  { word: 'sleep', definition: 'A natural state of rest for body and mind.', partOfSpeech: 'noun' },
  { word: 'small', definition: 'Little in size.', partOfSpeech: 'adjective' },
  { word: 'smile', definition: 'A pleased expression of the face.', partOfSpeech: 'noun' },
  { word: 'snow', definition: 'Soft white ice crystals falling from the sky.', partOfSpeech: 'noun' },
  { word: 'some', definition: 'An unspecified amount or number.', partOfSpeech: 'pronoun' },
  { word: 'song', definition: 'A short piece of music with words.', partOfSpeech: 'noun' },
  { word: 'sound', definition: 'Something that can be heard.', partOfSpeech: 'noun' },
  { word: 'south', definition: 'The direction opposite north.', partOfSpeech: 'noun' },
  { word: 'speak', definition: 'To say words aloud.', partOfSpeech: 'verb' },
  { word: 'spring', definition: 'The season between winter and summer.', partOfSpeech: 'noun' },
  { word: 'stand', definition: 'To be upright on the feet.', partOfSpeech: 'verb' },
  { word: 'star', definition: 'A bright object seen in the night sky.', partOfSpeech: 'noun' },
  { word: 'start', definition: 'To begin.', partOfSpeech: 'verb' },
  { word: 'stop', definition: 'To end movement or action.', partOfSpeech: 'verb' },
  { word: 'street', definition: 'A public road in a city or town.', partOfSpeech: 'noun' },
  { word: 'summer', definition: 'The warmest season of the year.', partOfSpeech: 'noun' },
  { word: 'sun', definition: 'The star at the center of our solar system.', partOfSpeech: 'noun' },
  { word: 'table', definition: 'A piece of furniture with a flat top.', partOfSpeech: 'noun' },
  { word: 'take', definition: 'To get into one’s hands or possession.', partOfSpeech: 'verb' },
  { word: 'talk', definition: 'To speak in order to communicate.', partOfSpeech: 'verb' },
  { word: 'teacher', definition: 'A person who teaches.', partOfSpeech: 'noun' },
  { word: 'tell', definition: 'To communicate information to someone.', partOfSpeech: 'verb' },
  { word: 'thank', definition: 'To express gratitude.', partOfSpeech: 'verb' },
  { word: 'think', definition: 'To use one’s mind actively.', partOfSpeech: 'verb' },
  { word: 'time', definition: 'The ongoing sequence of events.', partOfSpeech: 'noun' },
  { word: 'today', definition: 'The present day.', partOfSpeech: 'noun' },
  { word: 'together', definition: 'With each other; in one group.', partOfSpeech: 'adverb' },
  { word: 'tomorrow', definition: 'The day after today.', partOfSpeech: 'noun' },
  { word: 'tree', definition: 'A tall plant with a trunk and branches.', partOfSpeech: 'noun' },
  { word: 'under', definition: 'Beneath something.', partOfSpeech: 'preposition' },
  { word: 'up', definition: 'Toward a higher place or position.', partOfSpeech: 'adverb' },
  { word: 'use', definition: 'To employ for a purpose.', partOfSpeech: 'verb' },
  { word: 'very', definition: 'To a high degree.', partOfSpeech: 'adverb' },
  { word: 'walk', definition: 'To move at a regular pace by lifting and setting down each foot.', partOfSpeech: 'verb' },
  { word: 'warm', definition: 'Moderately hot.', partOfSpeech: 'adjective' },
  { word: 'water', definition: 'A clear liquid essential for life.', partOfSpeech: 'noun' },
  { word: 'way', definition: 'A method, style, or direction.', partOfSpeech: 'noun' },
  { word: 'week', definition: 'A period of seven days.', partOfSpeech: 'noun' },
  { word: 'white', definition: 'The lightest color.', partOfSpeech: 'adjective' },
  { word: 'wind', definition: 'Natural movement of air.', partOfSpeech: 'noun' },
  { word: 'window', definition: 'An opening in a wall fitted with glass.', partOfSpeech: 'noun' },
  { word: 'winter', definition: 'The coldest season of the year.', partOfSpeech: 'noun' },
  { word: 'woman', definition: 'An adult female human.', partOfSpeech: 'noun' },
  { word: 'work', definition: 'Activity involving effort to achieve a purpose.', partOfSpeech: 'noun' },
  { word: 'world', definition: 'The earth and all its people and things.', partOfSpeech: 'noun' },
  { word: 'write', definition: 'To form letters or words on a surface.', partOfSpeech: 'verb' },
  { word: 'year', definition: 'A period of twelve months.', partOfSpeech: 'noun' },
  { word: 'yellow', definition: 'A color between green and orange.', partOfSpeech: 'adjective' },
  { word: 'yes', definition: 'A word used to agree or confirm.', partOfSpeech: 'interjection' },
  { word: 'young', definition: 'Having lived or existed for only a short time.', partOfSpeech: 'adjective' },
];

const ONSETS = [
  'b', 'br', 'c', 'cr', 'd', 'dr', 'f', 'fr', 'g', 'gr', 'h', 'j', 'k', 'kr', 'l', 'm',
  'n', 'p', 'pr', 'qu', 'r', 's', 'st', 't', 'tr', 'v', 'w', 'z',
];

const NUCLEI = [
  'a', 'e', 'i', 'o', 'u', 'ai', 'ea', 'io', 'ou', 'ua', 'ie', 'oo',
];

const CODAS = [
  'b', 'c', 'ct', 'd', 'f', 'g', 'k', 'l', 'ld', 'm', 'n', 'nd', 'nt', 'p', 'r', 'rk',
  's', 'sk', 'st', 't', 'th', 'v', 'x', 'z',
];

const ENDINGS = [
  'al', 'ance', 'ate', 'dom', 'ence', 'ent', 'er', 'ery', 'ess', 'ful', 'graph', 'ic',
  'ify', 'ing', 'ion', 'ism', 'ist', 'ity', 'ive', 'less', 'logy', 'ment', 'ness', 'oid',
  'or', 'ory', 'ous', 'scope', 'ship', 'sion', 'tion', 'ture', 'ward', 'wise',
];

function pluralize(word: string): string {
  if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
    return `${word.slice(0, -1)}ies`;
  }
  if (/(s|x|z|ch|sh)$/.test(word)) {
    return `${word}es`;
  }
  return `${word}s`;
}

function pastTense(word: string): string {
  if (word.endsWith('e')) {
    return `${word}d`;
  }
  if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
    return `${word.slice(0, -1)}ied`;
  }
  return `${word}ed`;
}

function progressive(word: string): string {
  if (word.endsWith('e') && !word.endsWith('ee')) {
    return `${word.slice(0, -1)}ing`;
  }
  return `${word}ing`;
}

function buildInflectedForms(base: DictionaryEntry[]): DictionaryEntry[] {
  const generated: DictionaryEntry[] = [];
  const seen = new Set(base.map((entry) => entry.word));

  for (const entry of base) {
    if (entry.partOfSpeech === 'noun') {
      const plural = pluralize(entry.word);
      if (!seen.has(plural)) {
        seen.add(plural);
        generated.push({
          word: plural,
          definition: `Plural form of "${entry.word}".`,
          partOfSpeech: 'noun',
        });
      }
    }

    if (entry.partOfSpeech === 'verb') {
      const forms = [
        { word: `${entry.word}s`, definition: `Third-person singular form of "${entry.word}".` },
        { word: pastTense(entry.word), definition: `Past tense form of "${entry.word}".` },
        { word: progressive(entry.word), definition: `Progressive form of "${entry.word}".` },
      ];

      for (const form of forms) {
        if (!seen.has(form.word)) {
          seen.add(form.word);
          generated.push({
            word: form.word,
            definition: form.definition,
            partOfSpeech: 'verb',
          });
        }
      }
    }
  }

  return generated;
}

function buildSyllables(): string[] {
  const syllables: string[] = [];
  for (const onset of ONSETS) {
    for (const nucleus of NUCLEI) {
      for (const coda of CODAS) {
        syllables.push(`${onset}${nucleus}${coda}`);
      }
    }
  }
  return syllables;
}

function splitSyllables(word: string): string[] {
  const normalized = word.toLowerCase().trim();
  if (!normalized) {
    return [word];
  }

  const parts: string[] = [];
  let start = 0;
  let index = 0;

  while (index < normalized.length) {
    if (/[aeiouy]/.test(normalized[index])) {
      let j = index + 1;
      while (j < normalized.length && /[aeiouy]/.test(normalized[j])) {
        j += 1;
      }
      const nextConsonantStart = j;
      while (j < normalized.length && !/[aeiouy]/.test(normalized[j])) {
        j += 1;
      }
      const splitAt = nextConsonantStart + Math.min(1, Math.max(0, j - nextConsonantStart));
      if (splitAt > start && splitAt < normalized.length) {
        parts.push(normalized.slice(start, splitAt));
        start = splitAt;
      }
      index = j;
      continue;
    }
    index += 1;
  }

  if (start < normalized.length) {
    parts.push(normalized.slice(start));
  }

  if (parts.length === 0) {
    return [normalized];
  }

  return parts.filter(Boolean);
}

function estimateSyllables(word: string): number {
  return splitSyllables(word).length;
}

function toPronunciation(word: string, syllables: string[]): string {
  const merged = syllables.length > 0 ? syllables.join('-') : word;
  return `/${merged}/`;
}

function buildDetails(entry: DictionaryEntry): string {
  const letters = entry.word.length;
  const syllables = estimateSyllables(entry.word);

  switch (entry.partOfSpeech) {
    case 'noun':
      return `Usually used as a naming word in sentences. ${letters} letters, about ${syllables} syllable(s).`;
    case 'verb':
      return `Usually used as an action or state word. ${letters} letters, about ${syllables} syllable(s).`;
    case 'adjective':
      return `Usually used to describe qualities. ${letters} letters, about ${syllables} syllable(s).`;
    case 'adverb':
      return `Usually used to modify verbs, adjectives, or clauses. ${letters} letters, about ${syllables} syllable(s).`;
    case 'preposition':
      return `Usually used to show relation in place, time, or direction. ${letters} letters, about ${syllables} syllable(s).`;
    case 'pronoun':
      return `Usually used in place of a noun. ${letters} letters, about ${syllables} syllable(s).`;
    case 'conjunction':
      return `Usually used to connect words, phrases, or clauses. ${letters} letters, about ${syllables} syllable(s).`;
    case 'interjection':
      return `Usually used as a short emotional expression. ${letters} letters, about ${syllables} syllable(s).`;
    default:
      return `Generated entry used for offline search coverage and benchmark variety. ${letters} letters, about ${syllables} syllable(s).`;
  }
}

function buildExample(entry: DictionaryEntry): string {
  switch (entry.partOfSpeech) {
    case 'verb':
      return `Example: "We ${entry.word} every day to improve our skills."`;
    case 'adjective':
      return `Example: "That is a very ${entry.word} solution."`;
    case 'adverb':
      return `Example: "The process ran ${entry.word} during the test."`;
    case 'preposition':
      return `Example: "The note is ${entry.word} the keyboard."`;
    case 'interjection':
      return `Example: "\"${entry.word}!\" she said with excitement."`;
    default:
      return `Example: "I looked up ${entry.word} in the dictionary."`;
  }
}

function buildUsageTip(entry: DictionaryEntry): string {
  if (entry.partOfSpeech === 'other') {
    return 'Tip: This is a synthetic entry used to stress-test search and trie traversal.';
  }
  return `Tip: Try searching words that start with "${entry.word.slice(0, Math.min(3, entry.word.length))}" for related results.`;
}

function enrichEntries(entries: DictionaryEntry[]): DictionaryEntry[] {
  return entries.map((entry) => {
    const syllables = splitSyllables(entry.word);
    return {
      ...entry,
      details: buildDetails(entry),
      example: buildExample(entry),
      usageTip: buildUsageTip(entry),
      syllables,
      pronunciation: toPronunciation(entry.word, syllables),
    };
  });
}

export function buildCorpus(minimumSize = 60_000): DictionaryEntry[] {
  const baseWords: DictionaryEntry[] = [...SEED_WORDS, ...COMMON_WORDS];
  const inflectedWords = buildInflectedForms(baseWords);
  const entries: DictionaryEntry[] = [...baseWords, ...inflectedWords];
  const seen = new Set(entries.map((entry) => entry.word));
  const syllables = buildSyllables();

  for (const left of syllables) {
    for (const right of syllables) {
      for (const ending of ENDINGS) {
        if (entries.length >= minimumSize) {
          return enrichEntries(entries);
        }

        const word = `${left}${right}${ending}`;
        if (seen.has(word)) {
          continue;
        }

        seen.add(word);
        entries.push({
          word,
          definition: 'Synthetic dictionary entry generated for offline trie performance testing.',
          partOfSpeech: 'other',
        });
      }
    }
  }

  return enrichEntries(entries);
}
