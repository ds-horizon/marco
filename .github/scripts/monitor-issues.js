const axios = require("axios");
const { WebClient } = require("@slack/web-api");

const owner = 'dream-sports-labs'
const repo = 'react-native-performance-tracker'

const args = process.argv.slice(2)
const [
  GIT_SECRET,
  SLACK_BOT_TOKEN,
  SLACK_CHANNEL
] = args

if (!GIT_SECRET || !SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

const fetchDataFromDaysAgo = 1;
const filterIssuesWithinHoursAgo = 6;

const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open`;

const slackWrapper = (token, channel) => {
  const client = new WebClient(token);

  const sendMessage = async (args) => {
    try {
      await client.chat.postMessage({
        ...args,
        channel,
      });
    } catch (e) {
      console.error("Unable to send Slack message:", e.message);
    }
  };

  return {
    sendMessage,
    client,
    channel,
  };
};

async function fetchIssuesWithinSixHours() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - fetchDataFromDaysAgo * 24 * 60 * 60 * 1000); // One day ago
  const sixHoursAgo = new Date(now.getTime() - filterIssuesWithinHoursAgo * 60 * 60 * 1000); // Six hours ago

  let issuesWithinSixHours = [];
  let page = 1;
  let olderIssueFound = false;

  try {
    while (true) {
      console.log(`Fetching data for page: ${page}`);

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `token ${GIT_SECRET}`,
        },
        params: {
          page: page,
          per_page: 100,
          since: oneDayAgo.toISOString(), // Fetch issues created in the last 24 hours
        },
      });

      const issues = response.data.filter((issue) => !issue.pull_request);

      const recentIssues = issues.filter((issue) => {
        const createdAt = new Date(issue.created_at);

        // Break loop if an older issue is encountered
        if (createdAt < sixHoursAgo) {
          olderIssueFound = true;
          return false; // Exclude older issues
        }

        return createdAt <= now; // Include issues within the last 6 hours
      });

      issuesWithinSixHours.push(
        ...recentIssues.map((issue) => ({
          title: issue.title,
          url: issue.html_url,
          createdAt: issue.created_at,
        }))
      );

      if (olderIssueFound) break;

      const linkHeader = response.headers["link"];
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break;
      }

      page++;
    }

    return issuesWithinSixHours;
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error.message);
    return [];
  }
}

async function sendSlackNotification(issues) {
  if (issues.length === 0) {
    console.log("No issues found in the last 6 hours.");
    return;
  }

  const message = `:warning: *${issues.length} issue(s)* were created in the last *6 hours* in *${repo}*.`;
  const issueDetails = issues
    .map(
      (issue, index) =>
        `*${index + 1}.* <${issue.url}|${issue.title}> \n   _Created At:_ ${new Date(issue.createdAt).toLocaleString()}`
    )
    .join("\n\n");
  
  const slackMessage = {
    text: `${message}\n\n*Recent Issues:*\n${issueDetails}`,
  };

  const slack = slackWrapper(SLACK_BOT_TOKEN, SLACK_CHANNEL)
  await slack.sendMessage({
    text: slackMessage.text
  })

  console.log("***  Posted on Slack ***")
}

// Main function
async function monitorIssues() {
  const issuesWithinSixHours = await fetchIssuesWithinSixHours();

  console.log(issuesWithinSixHours);
  await sendSlackNotification(issuesWithinSixHours);
}

// Run the monitor function
monitorIssues();
