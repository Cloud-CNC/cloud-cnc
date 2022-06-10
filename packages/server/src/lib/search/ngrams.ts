/**
 * @fileoverview N-grams utility
 */

/**
 * Generate n-grams
 * 
 * **NOTE: this runs in and outputs at `O(n^3)`**
 * @param raw Raw input
 * @param min Minimum n-gram size
 * @param max Maximum n-gram size
 * @param limit Maximum total n-grams (To prevent DoS)
 * @returns N-grams of various sizes
 */
const generateNgrams = (raw: string, min: number, max: number, limit: number) =>
{
  //Parse words
  const words = raw.split(/\s+/);

  //Generate n-grams
  const ngrams = [];

  //Iterate over words
  for (const word of words)
  {
    //Iterate over possible sizes
    for (let n = min; n <= max; n++)
    {
      //Iterate over positions
      for (let i = 0; i <= word.length - n; i++)
      {
        //Enforce the limit
        if (ngrams.length >= limit)
        {
          return ngrams;
        }

        //Create the n-gram
        const ngram = word.substring(i, i+n);

        //Add
        ngrams.push(ngram);
      }
    }
  }

  return ngrams;
};

//Export
export default generateNgrams;