# Milestone 6 AI Tool Reflection

## Overview

Throughout the Buckeye Marketplace project, I used AI tools to support multiple phases of the software development life cycle, including planning, coding, debugging, testing, deployment, and documentation. AI tools helped me move faster, understand errors, and organize my final deliverables, but I still had to review, test, and adapt the suggestions to fit my actual project.

## Tools Used

- GitHub Copilot
- Claude
- ChatGPT
- AI-assisted debugging and documentation support

## How I Used AI Across the SDLC

### Planning and Requirements

AI helped me break down the project into user-facing and admin-facing features. This included thinking through marketplace flows such as browsing products, adding products to a cart, checkout, order history, and admin product/order management.

Example prompt:
> Help me organize the main user and admin flows for an e-commerce marketplace project.

Outcome:
AI helped identify the major flows that needed to be implemented and tested for the final milestone.

### Design and Architecture

AI helped me think through the separation between the React frontend, .NET backend API, and database layer. It also helped explain how frontend environment variables, backend app settings, and production connection strings should be handled during deployment.

Example prompt:
> Explain how my React frontend, .NET API, and Azure SQL database should connect in production.

Outcome:
This helped me understand that the frontend should call the deployed backend URL, while the backend should use Azure App Service configuration for the database connection string and JWT settings.

### Coding Assistance

GitHub Copilot and other AI tools helped with writing and adjusting frontend/backend code. This included generating repetitive code, helping with TypeScript or C# syntax, and suggesting structure for API calls and UI components.

Example prompt:
> Help me create a reusable product card component for a marketplace frontend.

Outcome:
AI helped speed up development, but I still reviewed and modified the output to match my project’s actual data model and UI needs.

### Debugging

AI was especially useful during deployment and debugging. When terminal commands failed or Azure returned errors, AI helped interpret the error messages and suggest next steps.

Examples of issues AI helped with:
- Azure CLI installation
- Azure SQL region restrictions
- Bash errors caused by special characters in passwords
- Azure App Service quota issues
- Frontend build errors
- CORS setup between frontend and backend
- GitHub Actions publish profile issues

Example prompt:
> My Azure App Service deploy says the site failed to start. What should I check?

Outcome:
AI helped me check app settings, connection strings, logs, runtime configuration, and deployment status.

### Testing and Quality Assurance

AI helped me create a testing plan that covered the major user and admin flows. This made it easier to document what needed to be tested before submission.

Example prompt:
> Create a testing checklist for my marketplace app covering user flows, admin flows, browser testing, and mobile responsiveness.

Outcome:
AI helped produce a structured QA document with test cases, expected results, actual results, and status.

### Documentation

AI helped organize my README, testing document, user guide, admin guide, and deployment notes. This was useful because the final milestone required multiple written deliverables in addition to working code.

Example prompt:
> Help me write technical documentation for a React, .NET, and Azure SQL marketplace app.

Outcome:
AI helped create documentation sections for production deployment, environment variables, setup instructions, deployment instructions, and project architecture.

## What Worked Well

AI worked well for:
- Explaining confusing deployment errors in plain language
- Generating command-line steps in the correct order
- Helping structure documentation
- Creating checklists for testing and submission
- Debugging Azure CLI, Git, and GitHub Actions issues
- Reducing time spent searching for common syntax or configuration patterns

The most helpful use of AI was during deployment because many Azure errors were unclear at first. AI helped identify whether an issue was caused by my code, Azure configuration, region policy, quota limits, or secrets.

## What Did Not Work Well

AI was not perfect. Sometimes suggestions had to be adjusted for my actual project structure. For example, sample deployment commands did not always match my folder names, app names, or Azure resource names. I also had to be careful not to paste secrets such as connection strings, JWT keys, SQL passwords, or publish profiles into AI tools.

AI could also suggest a correct general approach but still require manual verification. I had to test commands, check terminal output, inspect GitHub Actions logs, and confirm that the deployed app worked in the browser.

## Impact on Productivity and Learning

AI improved my productivity by helping me troubleshoot faster and organize the deployment process into manageable steps. It also helped me learn more about how production deployment works, especially the difference between local development settings and production environment variables.

Instead of only copying commands, I gained a better understanding of:
- Azure resource groups
- Azure SQL Database
- App Service deployment
- Connection strings and runtime secrets
- CORS
- Frontend production builds
- GitHub Actions workflows
- Deployment troubleshooting

## Lessons Learned

The biggest lesson I learned is that AI is most useful when I use it as a guide, not as a replacement for understanding. I still needed to read errors carefully, verify outputs, protect secrets, and test the final application myself.

I also learned that deployment is a major part of the SDLC. A project can work locally but still require careful configuration to run in production. AI helped me work through that process, but the final responsibility for testing and confirming the application was mine.

## Conclusion

Overall, AI tools were helpful throughout the Buckeye Marketplace project. They supported coding, debugging, deployment, testing, and documentation. The most valuable benefit was helping me understand and solve deployment issues quickly. However, I had to review every suggestion, adapt it to my project, and make sure the final result was secure, working, and accurate.
