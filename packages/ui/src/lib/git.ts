/**
 * @fileoverview Git helper
 */

/**
 * Generate a browser link to view the commit
 * @param remote Repository remote URL
 * @param branch Commit branch name
 * @param commit Commit hash
 */
export const generateLink = (remote: string, _: string, commit: string) =>
{
  //Parse the remote
  const parsed = new URL(remote);

  //Set the protocol
  parsed.protocol = 'https';

  //Strip ".git" extension
  parsed.pathname = parsed.pathname.replace(/\.[^.]+$/, '');

  //Update the URL
  switch (parsed.hostname)
  {
    //GitHub
    case 'www.github.com':
    case 'github.com':
      parsed.host = 'github.com';
      parsed.pathname += `/commit/${commit}`;
      break;

    //GitLab
    case 'www.gitlab.com':
    case 'gitlab.com':
      parsed.host = 'gitlab.com';
      parsed.pathname += `/-/commit/${commit}`;
      break;

    //Bitbucket
    case 'www.bitbucket.com':
    case 'bitbucket.com':
      parsed.host = 'bitbucket.com';
      parsed.pathname += `/commits/${commit}`;
      break;

    //Gitea
    case 'www.gitea.com':
    case 'gitea.com':
      parsed.host = 'gitea.com';
      parsed.pathname += `/commit/${commit}`;
      break;

    //Gitee
    case 'www.gitee.com':
    case 'gitee.com':
      parsed.host = 'gitee.com';
      parsed.pathname += `/commit/${commit}`;
      break;

    default:
      parsed.pathname += `/commit/${commit}`;
      console.warn(`Unknown Git host ${parsed.pathname}!`);
      break;
  }

  return parsed.toString();
};