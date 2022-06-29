/**
 * @fileoverview Project licenses
 */

/**
 * Get project licenses
 * @returns Project licenses
 */
const getLicenses = async () =>
{
  //Get the licenses path
  const path = import.meta.env.LICENSES_PATH;

  if (path != null)
  {
    //Fetch the licenses file
    const res = await fetch(path);

    if (!res.ok)
    {
      throw new Error('Failed to get licenses!');
    }

    //Get the response text
    const text = await res.text();

    return text;
  }
  else
  {
    return '[Licenses not aggregated in development mode]';
  }
};

//Export
export default getLicenses;