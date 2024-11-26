import { ref } from 'vue';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
    author: "Edsger W. Dijkstra"
  },
  {
    text: "AI is whatever hasn't been done yet.",
    author: "Larry Tesler"
  },
  {
    text: "The real question is not whether machines think but whether men do.",
    author: "B.F. Skinner"
  },
  {
    text: "A year spent in artificial intelligence is enough to make one believe in God.",
    author: "Alan Perlis"
  },
  {
    text: "Artificial intelligence is the science of making machines do things that would require intelligence if done by men.",
    author: "Marvin Minsky"
  },
  {
    text: "The development of full artificial intelligence could spell the end of the human race.",
    author: "Stephen Hawking"
  },
  {
    text: "AI will probably most likely lead to the end of the world, but in the meantime, there'll be great companies.",
    author: "Sam Altman"
  },
  {
    text: "The key to artificial intelligence has always been the representation.",
    author: "Jeff Hawkins"
  },
  {
    text: "Some people worry that artificial intelligence will make us feel inferior, but then, anybody in their right mind should have an inferiority complex every time they look at a flower.",
    author: "Alan Kay"
  },
  {
    text: "The real danger is not that computers will begin to think like men, but that men will begin to think like computers.",
    author: "Sydney J. Harris"
  },
  {
    text: "By far, the greatest danger of Artificial Intelligence is that people conclude too early that they understand it.",
    author: "Eliezer Yudkowsky"
  },
  {
    text: "Machine intelligence is the last invention that humanity will ever need to make.",
    author: "Nick Bostrom"
  }
];

export const useAiQuotes = () => {
  const currentQuote = ref<Quote>(quotes[Math.floor(Math.random() * quotes.length)]);

  const getRandomQuote = () => {
    currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
    return currentQuote.value;
  };

  return {
    currentQuote,
    getRandomQuote,
  };
};
