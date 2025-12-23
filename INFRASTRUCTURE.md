# AquaRandom Infrastructure Documentation

## Overview

AquaRandom is a serverless web application that delivers random content (facts, news, sports, memes) to users. The application is designed for QR code distribution and includes a lead capture system that collects user information after a configurable number of free content views.

## Architecture Diagram

```
                                    +------------------+
                                    |   QR Code Scan   |
                                    +--------+---------+
                                             |
                                             v
+----------------------------------------------------------------------------------------------------------+
|                                        AWS CLOUD                                                          |
|                                                                                                           |
|  +------------------+         +-------------------+         +------------------+                          |
|  |                  |         |                   |         |                  |                          |
|  |  AWS Amplify     | <-----> |   API Gateway     | <-----> |  AWS Lambda      |                          |
|  |  (Static Host)   |   HTTP  |   (REST API)      |         |  (Node.js 18.x)  |                          |
|  |                  |         |                   |         |                  |                          |
|  +------------------+         +-------------------+         +--------+---------+                          |
|         |                                                            |                                    |
|         | Serves                                                     | Read/Write                         |
|         v                                                            v                                    |
|  +------------------+                                       +------------------+                          |
|  |   public/        |                                       |   DynamoDB       |                          |
|  |   - index.html   |                                       |   - visitors     |                          |
|  |   - app.js       |                                       |   - userinfo     |                          |
|  |   - styles.css   |                                       |   - interactions |                          |
|  |   - config.js    |                                       +------------------+                          |
|  +------------------+                                                                                     |
|                                                                                                           |
+----------------------------------------------------------------------------------------------------------+
```

## Live Endpoints

| Service | URL |
|---------|-----|
| Frontend (Amplify) | https://main.d2zl0us3oqkida.amplifyapp.com |
| API Gateway | https://qlzcidmp3c.execute-api.us-east-1.amazonaws.com/Prod |
| Health Check | https://qlzcidmp3c.execute-api.us-east-1.amazonaws.com/Prod/api/health |

## AWS Resources

### 1. AWS Amplify (Frontend Hosting)

**App ID:** `d2zl0us3oqkida`
**Region:** `us-east-1`
**Branch:** `main`

Amplify hosts the static frontend files and automatically deploys when changes are pushed to the GitHub repository.

**Build Configuration (`amplify.yml`):**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "No build dependencies needed for static frontend"
    build:
      commands:
        - echo "Static files ready for deployment"
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
  cache:
    paths: []
```

**Deployed Files:**
- `index.html` - Main HTML page with water-themed UI
- `app.js` - Frontend JavaScript application logic
- `styles.css` - CSS styles with ocean/water theme
- `config.js` - API endpoint configuration

---

### 2. Amazon API Gateway (REST API)

**API ID:** `qlzcidmp3c`
**Stage:** `Prod`
**Type:** REST API (created by SAM)

API Gateway provides the REST API endpoints that route requests to the Lambda function.

**CORS Configuration:**
- Allowed Origins: `*`
- Allowed Methods: `GET, POST, OPTIONS`
- Allowed Headers: `Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token`

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check endpoint |
| GET | `/api/config` | Returns configuration (free hits limit) |
| POST | `/api/visitor/init` | Initialize or retrieve visitor session |
| POST | `/api/visitor/accept-cookies` | Record cookie consent |
| POST | `/api/visitor/save-info` | Save user contact information |
| POST | `/api/content/random` | Get random content (fact, news, sports, meme) |
| OPTIONS | `/api/*` | CORS preflight handlers |

---

### 3. AWS Lambda (Compute)

**Function Name:** `aquarandom-api`
**Runtime:** Node.js 18.x
**Memory:** 256 MB
**Timeout:** 30 seconds
**Handler:** `index.handler`

The Lambda function handles all API logic including:
- Session management
- Cookie consent tracking
- User information storage
- Content delivery
- Hit count tracking

**Environment Variables:**
| Variable | Value |
|----------|-------|
| `VISITORS_TABLE` | `aquarandom-visitors` |
| `USER_INFO_TABLE` | `aquarandom-userinfo` |
| `INTERACTIONS_TABLE` | `aquarandom-interactions` |
| `FREE_HITS_LIMIT` | `3` |

**IAM Permissions:**
- DynamoDB CRUD access to all three tables

---

### 4. Amazon DynamoDB (Database)

Three tables store application data with on-demand (PAY_PER_REQUEST) billing:

#### Table: `aquarandom-visitors`

**Primary Key:** `sessionId` (String)

Stores visitor session data and metadata.

| Attribute | Type | Description |
|-----------|------|-------------|
| `sessionId` | String | Primary key - unique session identifier |
| `id` | String | Visitor UUID |
| `ipAddress` | String | Client IP address |
| `userAgent` | String | Browser user agent |
| `language` | String | Preferred language (en/es) |
| `platform` | String | Operating system/platform |
| `screenResolution` | String | Screen dimensions |
| `timezone` | String | Client timezone |
| `referrer` | String | Referring URL |
| `cookiesAccepted` | Boolean | Cookie consent status |
| `cookiesAcceptedAt` | String | Timestamp of consent |
| `hitCount` | Number | Number of content views |
| `createdAt` | String | Creation timestamp |
| `updatedAt` | String | Last update timestamp |

#### Table: `aquarandom-userinfo`

**Primary Key:** `visitorId` (String)

Stores collected user contact information.

| Attribute | Type | Description |
|-----------|------|-------------|
| `visitorId` | String | Primary key - references visitor |
| `email` | String | User email address |
| `phone` | String | User phone number |
| `name` | String | User name |
| `preferredLanguage` | String | Language preference |
| `createdAt` | String | Creation timestamp |

#### Table: `aquarandom-interactions`

**Primary Key:** `id` (String)
**TTL Enabled:** Yes (attribute: `ttl`)

Logs all content interactions for analytics.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | String | Primary key - unique interaction ID |
| `visitorId` | String | Reference to visitor |
| `contentType` | String | Type of content (fact, news, sports, meme) |
| `contentId` | String | Unique content identifier |
| `createdAt` | String | Interaction timestamp |
| `ttl` | Number | Time-to-live for automatic deletion |

---

## CloudFormation Stack

**Stack Name:** `aquarandom-backend`
**Region:** `us-east-1`
**Template:** `template.yaml` (SAM template)

The infrastructure is defined as code using AWS SAM (Serverless Application Model).

**Stack Outputs:**
| Output | Value |
|--------|-------|
| `ApiUrl` | https://qlzcidmp3c.execute-api.us-east-1.amazonaws.com/Prod |
| `FunctionArn` | arn:aws:lambda:us-east-1:434493181765:function:aquarandom-api |

---

## GitHub Repository

**Repository:** https://github.com/fherrera-zonda/random-facts-page
**Branch:** `main`

The repository is connected to AWS Amplify for automatic deployments.

---

## Application Flow

```
1. User scans QR code
         |
         v
2. Browser loads Amplify-hosted frontend
         |
         v
3. Frontend calls POST /api/visitor/init
   - Creates new visitor session or retrieves existing
   - Returns hit count and cookie status
         |
         v
4. Cookie consent modal displayed
   - User clicks "Accept"
   - Frontend calls POST /api/visitor/accept-cookies
         |
         v
5. User clicks content button (Fact, News, Sports, Meme, Random)
   - Frontend calls POST /api/content/random
   - Lambda checks:
     a. Cookies accepted? (if no, return 403)
     b. Hit count < limit OR user info provided? (if no, return 403)
   - Returns random content
   - Increments hit count
         |
         v
6. After FREE_HITS_LIMIT (3) views without user info:
   - User info modal displayed
   - User enters email (required), name, phone (optional)
   - Frontend calls POST /api/visitor/save-info
   - User can continue viewing unlimited content
```

---

## Content Types

### Fun Facts (18 items)
Bilingual facts (English/Spanish) about science, nature, and El Salvador.

### News (5 items)
Curated environmental and El Salvador news in both languages.

### Sports News (5 items)
Soccer news from major leagues (La Liga, Premier League, Liga MX, etc.)

### Memes (5 per language)
Language-specific memes using popular meme templates.

---

## Configuration

### Changing Free Hits Limit

Update the `FREE_HITS_LIMIT` environment variable:

1. **Via SAM template:** Edit `template.yaml` line 15
2. **Redeploy:** Run `./deploy.sh`

### Adding Content

Edit `lambda/index.js` and add items to the appropriate arrays:
- `funFacts` (lines 20-39)
- `generalNews` (lines 41-47)
- `sportsNews` (lines 49-55)
- `spanishMemes` (lines 57-63)
- `englishMemes` (lines 65-71)

---

## Deployment

### Backend Deployment

```bash
# From project root
./deploy.sh

# Or manually:
cd lambda && npm install --production && cd ..
sam build --profile personal
sam deploy --stack-name aquarandom-backend \
  --capabilities CAPABILITY_IAM \
  --region us-east-1 \
  --profile personal \
  --resolve-s3 \
  --no-confirm-changeset
```

### Frontend Deployment

```bash
git add .
git commit -m "Your changes"
git push
```

Amplify automatically builds and deploys on push to `main`.

---

## Monitoring & Debugging

### CloudWatch Logs

Lambda logs are available in CloudWatch:
- Log Group: `/aws/lambda/aquarandom-api`

### API Gateway Logs

Enable in API Gateway console for request/response logging.

### DynamoDB Metrics

Available in DynamoDB console:
- Read/Write capacity units consumed
- Throttled requests
- Latency

---

## Cost Estimation

All services use pay-per-use pricing:

| Service | Pricing Model |
|---------|---------------|
| Amplify | $0.01/GB served + build minutes |
| API Gateway | $3.50/million requests |
| Lambda | $0.20/million requests + compute time |
| DynamoDB | $1.25/million write, $0.25/million read |

**Estimated Monthly Cost (low traffic):** < $1/month

---

## Security Considerations

1. **CORS:** Currently allows all origins (`*`). For production, restrict to your domain.
2. **API Gateway:** No authentication required. Consider adding API keys for rate limiting.
3. **DynamoDB:** Tables are not encrypted at rest by default. Enable for sensitive data.
4. **User Data:** Email/phone stored in plain text. Consider encryption for GDPR compliance.

---

## Files Structure

```
random-facts-page/
├── public/                    # Frontend (served by Amplify)
│   ├── index.html            # Main HTML page
│   ├── app.js                # Frontend application
│   ├── styles.css            # CSS styles
│   └── config.js             # API URL configuration
├── lambda/                    # Lambda function
│   ├── index.js              # Handler + content providers
│   ├── package.json          # Dependencies
│   └── package-lock.json     # Lock file
├── template.yaml             # SAM infrastructure template
├── amplify.yml               # Amplify build configuration
├── deploy.sh                 # Backend deployment script
├── .gitignore                # Git ignore rules
└── INFRASTRUCTURE.md         # This documentation
```

---

## Troubleshooting

### Frontend shows "Error loading content"

1. Check browser console for errors
2. Verify API Gateway URL in `public/config.js`
3. Check Lambda CloudWatch logs

### API returns 403 "cookies_required"

User hasn't accepted cookies. Clear localStorage and refresh.

### API returns 403 "info_required"

User has exceeded free hits. Provide email to continue.

### Amplify deployment fails

1. Check Amplify console for build logs
2. Verify `amplify.yml` syntax
3. Ensure `public/` directory exists with all files

### Lambda timeout

1. Check DynamoDB throttling
2. Increase Lambda timeout in `template.yaml`
3. Check for infinite loops in code

---

## Support

**AWS Profile:** `personal`
**Region:** `us-east-1`
**GitHub:** https://github.com/fherrera-zonda/random-facts-page

