# API Documentation

*Last updated: 11/29/2025, 1:01:30 PM*

This documentation was automatically generated using AI.

---

```markdown
## API Documentation: /api/admin/most-used-prompts

### 1. Endpoint:

`/api/admin/most-used-prompts`

### 2. Method(s):

`GET`

### 3. Description:

This endpoint retrieves a list of the most frequently used prompt domains, classified using the OpenRouter API. It fetches all prompts from the Supabase `prompts` table, classifies them into domain and type using a fine-tuned prompt on OpenRouter, aggregates the domain counts, and returns a sorted list of domains by usage frequency.  This is primarily designed for administrative analysis of prompt usage patterns.

### 4. Request Body:

N/A (GET request)

### 5. Query Parameters:

N/A

### 6. Response:

The API returns a JSON array of objects. Each object contains the `domain` and its corresponding `count`. The array is sorted in descending order based on the `count`.

```json
[
  {
    "domain": "Coding",
    "count": 25
  },
  {
    "domain": "Writing",
    "count": 18
  },
  {
    "domain": "Marketing",
    "count": 12
  },
  {
    "domain": "Unknown",
    "count": 5
  }
]
```

### 7. Status Codes:

*   `200 OK`: Successfully retrieved and processed the most used prompt domains.
*   `500 Internal Server Error`: An error occurred while fetching prompts from Supabase or classifying prompts using the OpenRouter API. The response body will contain an `error` field with the error message.

    ```json
    {
      "error": "Supabase error: example error message"
    }
    ```

### 8. Authentication:

Requires the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_OPENROUTER_API_KEY` environment variables to be set.  The Supabase keys enable access to the prompt data and OpenRouter API key authorizes the prompt classification requests.  This endpoint should ideally be behind an authentication layer (e.g., middleware) to restrict access to administrative users.

### 9. Example Request:

```bash
curl -X GET http://localhost:3000/api/admin/most-used-prompts
```

```javascript
async function getMostUsedPrompts() {
  const response = await fetch('/api/admin/most-used-prompts');
  const data = await response.json();
  console.log(data);
}

getMostUsedPrompts();
```

### 10. Example Response:

```json
[
  {
    "domain": "E-commerce",
    "count": 15
  },
  {
    "domain": "Social Media",
    "count": 10
  },
  {
    "domain": "Customer Service",
    "count": 7
  },
  {
    "domain": "Unknown",
    "count": 2
  }
]
```


---

```markdown
## API Documentation: /api/admin/prompts-by-user

### 1. Endpoint

`/api/admin/prompts-by-user`

### 2. Method(s)

`GET`

### 3. Description

This endpoint retrieves a list of users along with the prompts they have created.  It returns an array of user objects, each containing user details, the number of prompts created by the user, and the actual prompt values. The results are sorted in descending order based on the number of prompts created. This route is intended for administrative purposes.

### 4. Request Body

N/A (GET request)

### 5. Query Parameters

N/A (GET request)

### 6. Response

The endpoint returns a JSON array of user objects. Each object has the following structure:

```json
[
  {
    "user_id": "string (UUID)",
    "user_name": "string",
    "user_email": "string",
    "user_image": "string | null",
    "prompt_count": "number",
    "prompts": "string[]"
  },
  ...
]
```

*   **`user_id`**:  The unique identifier of the user.
*   **`user_name`**:  The name of the user.
*   **`user_email`**:  The email address of the user.
*   **`user_image`**:  The URL of the user's profile image, or `null` if no image is available.
*   **`prompt_count`**: The number of prompts created by the user.
*   **`prompts`**: An array of strings, where each string is the `prompt_value` of a prompt created by the user.

### 7. Status Codes

*   **200 OK**: Successfully retrieved the list of users and prompts.
*   **500 Internal Server Error**: An error occurred while fetching the data from the database. The response body will contain an error message.

### 8. Authentication

This endpoint likely requires authentication to prevent unauthorized access to user and prompt data, assuming it's an admin route. However, based solely on the code provided, we cannot definitively confirm the authentication mechanism.  It's crucial to implement appropriate authentication and authorization checks within the route handler.

### 9. Example Request

**cURL:**

```bash
curl -X GET /api/admin/prompts-by-user
```

**JavaScript (fetch API):**

```javascript
fetch('/api/admin/prompts-by-user')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 10. Example Response

```json
[
  {
    "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "user_name": "Admin User",
    "user_email": "admin@example.com",
    "user_image": "https://example.com/admin.jpg",
    "prompt_count": 3,
    "prompts": [
      "Write a story about a magical tree.",
      "Describe the feeling of being weightless.",
      "Create a poem about the ocean."
    ]
  },
  {
    "user_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
    "user_name": "Regular User",
    "user_email": "user@example.com",
    "user_image": null,
    "prompt_count": 1,
    "prompts": [
      "Generate a list of healthy recipes."
    ]
  }
]
```


---

```markdown
# API Endpoint: /api/admin/users

## 1. Endpoint

`/api/admin/users`

## 2. Method(s)

*   `GET`

## 3. Description

This endpoint retrieves a list of users from the database, including their ID, name, email, username, and creation timestamp.  The users are ordered by creation date in descending order (newest first). It's intended for administrative use.

## 4. Request Body

N/A. The `GET` method does not require a request body.

## 5. Query Parameters

N/A. This endpoint does not accept any query parameters.

## 6. Response

The API returns a JSON array of user objects. Each object contains the following properties:

*   `id`: (string) The user's unique ID.
*   `name`: (string) The user's full name.
*   `email`: (string) The user's email address.
*   `username`: (string) The user's username.
*   `created_at`: (string) The timestamp when the user was created, in ISO 8601 format.

## 7. Status Codes

*   `200 OK`: Successfully retrieved the list of users.
*   `500 Internal Server Error`: An error occurred while fetching the users from the database. The response body will contain an error message.

## 8. Authentication

This endpoint likely requires administrative authentication to access user information.  The provided code snippet doesn't implement any explicit authentication.  In a production environment, a middleware or similar mechanism should be in place to verify the user's administrative privileges.  It is important to implement proper authentication and authorization to protect sensitive user data.

## 9. Example Request

**cURL Example:**

```bash
curl -X GET /api/admin/users
```

**JavaScript (fetch) Example:**

```javascript
fetch('/api/admin/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## 10. Example Response

```json
[
  {
    "id": "user123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "created_at": "2023-10-27T10:00:00.000Z"
  },
  {
    "id": "user456",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "username": "janesmith",
    "created_at": "2023-10-26T15:30:00.000Z"
  }
]
```

**Error Response Example (Status Code 500):**

```json
{
  "error": "Failed to fetch users: Database connection error"
}
```


---

```markdown
# /api/auth/[...nextauth] API Documentation

## 1. Endpoint
`/api/auth/[...nextauth]`

## 2. Method(s)
`GET`, `POST`

## 3. Description
This endpoint handles authentication using NextAuth.js. It configures Google OAuth as an authentication provider and saves user information to a Supabase database upon successful sign-in. This API route is a catch-all route for NextAuth.js.

## 4. Request Body
N/A - This endpoint is handled by NextAuth.js and doesn't directly process a request body in the traditional sense. The request is initiated by the client-side NextAuth.js library.

## 5. Query Parameters
N/A - NextAuth.js handles query parameters internally for OAuth flows. Common parameters you might see during the OAuth flow include `code`, `state`, `callbackUrl`, and `error`.

## 6. Response
The response is handled by NextAuth.js internally and involves setting cookies and redirecting the user to the appropriate URL after authentication. No specific JSON is returned directly.

## 7. Status Codes
While this endpoint doesn't return explicit status codes, potential scenarios that can lead to errors include:

*   **302 Found**: Redirects during the authentication flow.
*   **500 Internal Server Error**: Potential error during Supabase insert (logged to the console). Note that NextAuth.js might handle this gracefully and redirect to an error page.

## 8. Authentication
Yes, this endpoint *is* for authentication. It's the core route for handling user login, sign-up, and session management via NextAuth.js.

## 9. Example Request

Since this is a NextAuth.js route, direct cURL requests are not the intended usage. The interaction typically involves clicking a "Sign In" button that triggers a client-side call to NextAuth.js.

JavaScript example using `next-auth/react`:

```javascript
import { signIn } from 'next-auth/react'

async function handleSignIn() {
  signIn('google', { callbackUrl: '/profile' })
}
```

## 10. Example Response

N/A - As mentioned above, there's no specific JSON response directly from this endpoint. NextAuth.js manages setting cookies and redirecting the user. The successful authentication results in cookies being set to maintain the session, and a redirect to the callback URL (e.g., `/profile` in the above example).

Instead of a JSON response, you'd see cookies in your browser's developer tools, such as `next-auth.session-token` and related cookies set by NextAuth.js.

Example of what might be stored in the `users` table in Supabase upon successful authentication:

```json
{
  "id": "some-unique-user-id",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "image": "url-to-user-image",
  "username": "John"
}
```


---

```markdown
# /api/compare-llm API Documentation

## 1. Endpoint

`/api/compare-llm`

## 2. Method(s)

`POST`

## 3. Description

This endpoint receives a user prompt and a list of three language model IDs. It then sends the prompt to each of the specified models through the OpenRouter API and streams the responses back to the client, enabling a comparison of the models' outputs.

## 4. Request Body

The request body should be a JSON object with the following structure:

```json
{
  "prompt": string,
  "models": string[]
}
```

*   `prompt`: (string, required) The user's input prompt to be sent to the models.
*   `models`: (string[], required) An array of three language model IDs to be compared. For example: `["google/palm-2-chat-bison", "openai/gpt-3.5-turbo", "anthropic/claude-v1"]`.

## 5. Query Parameters

None

## 6. Response

The API returns a streaming response with `Content-Type: text/event-stream`.  The data stream contains the responses from each of the specified models, prefixed with a model identifier.  Errors from individual models are also streamed.

## 7. Status Codes

*   **200 OK**: Successfully processed the request and streaming responses.
*   **400 Bad Request**: Invalid request body (e.g., missing `prompt`, invalid `models` array).  The response body will be a JSON object with an `error` field.
    ```json
    {
      "error": "Invalid prompt or model selection"
    }
    ```
*   **500 Internal Server Error**: An error occurred while processing the request, such as an issue with the OpenRouter API. The response body will be a JSON object with an `error` field.
    ```json
    {
      "error": "Internal Server Error"
    }
    ```

## 8. Authentication

Requires an OpenRouter API key to be set in the environment variable `NEXT_PUBLIC_OPENROUTER_API_KEY`.

## 9. Example Request

**cURL:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "prompt": "Explain the theory of relativity.",
  "models": ["google/palm-2-chat-bison", "openai/gpt-3.5-turbo", "anthropic/claude-v1"]
}' https://your-domain.com/api/compare-llm
```

**JavaScript (fetch):**

```javascript
const data = {
  prompt: "Explain the theory of relativity.",
  models: ["google/palm-2-chat-bison", "openai/gpt-3.5-turbo", "anthropic/claude-v1"],
};

fetch('/api/compare-llm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let partialChunk = "";

  return new ReadableStream({
    start(controller) {
      function push() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          controller.enqueue(chunk);
          push();
        });
      }

      push();
    },
  });
})
.then(stream => new Response(stream))
.then(response => response.body)
.then(rb => {
    const reader = rb.getReader();

    return new ReadableStream({
        start(controller) {
            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        return;
                    }

                    const chunk = new TextDecoder("utf-8").decode(value);
                    controller.enqueue(chunk);
                    push();
                })
            }
            push();
        }
    });
})
.then(stream => new Response(stream, { headers: { 'Content-Type': 'text/html' } }))
.then(result => result.text())
.then(body => {
  console.log(body);
});

```

## 10. Example Response

The response is a streaming text/event-stream.  The exact content will vary based on the models and the prompt. Here's an example of the stream's format:

```
\n\n--- Model 1 (google/palm-2-chat-bison) ---\n\nThe theory of relativity, developed by Albert Einstein, encompasses two interrelated physical theories: special relativity and general relativity.  Special relativity, introduced in 1905, deals with the relationship between space and time for observers moving at constant velocities.  It postulates that the speed of light in a vacuum is constant for all observers, regardless of the motion of the light source.  This has several counterintuitive consequences, such as time dilation (time passing slower for moving observers) and length contraction (objects appearing shorter in the direction of motion).

\n\n--- Model 2 (openai/gpt-3.5-turbo) ---\n\nThe theory of relativity, developed by Albert Einstein, is one of the most important and influential scientific theories of the 20th century. It actually consists of two related theories: special relativity, which was published in 1905, and general relativity, published in 1915.

Special relativity deals with the relationship between space and time. Its two main postulates are:

1.  The laws of physics are the same for all observers in uniform motion relative to one another (i.e., inertial reference frames).
2.  The speed of light in a vacuum is the same for all observers, regardless of the motion of the light source.

These seemingly simple postulates have profound consequences. They lead to concepts such as time dilation (time passing slower for moving objects), length contraction (objects appearing shorter in the direction of motion), and the equivalence of mass and energy (E=mc^2).

\n\n--- Model 3 (anthropic/claude-v1) ---\n\nThe theory of relativity encompasses two interrelated theories developed primarily by Albert Einstein: special relativity (1905) and general relativity (1915).

Special relativity deals with the relationship between space and time for observers in uniform motion (constant velocity). Its postulates are:

1. The laws of physics are the same for all inertial (non-accelerating) observers.
2. The speed of light in a vacuum is the same for all inertial observers, regardless of the motion of the light source.

Key consequences of special relativity include:

* Time dilation: Moving clocks run slower relative to stationary observers.
* Length contraction: Objects appear shorter in the direction of motion when observed from a moving frame of reference.
* Mass increase: The mass of an object increases as its velocity increases.
* Mass-energy equivalence: Energy (E) and mass (m) are interchangeable, related by the famous equation E=mc^2, where c is the speed of light.

General relativity extends special relativity to include gravity. It describes gravity not as a force, but as a curvature of spacetime caused by the presence of mass and energy. Key concepts in general relativity include:

* Spacetime: A four-dimensional fabric of space and time that is warped and curved by gravity.
* Gravitational time dilation: Time runs slower in stronger gravitational fields.
* Gravitational lensing: Light bends as it passes by massive objects due to the curvature of spacetime.
* Black holes: Regions of spacetime where gravity is so strong that nothing, not even light, can escape.

General relativity has been experimentally verified through observations of gravitational lensing, the precession of Mercury's orbit, and the detection of gravitational waves. It is essential for understanding the behavior of large-scale structures in the universe, such as galaxies and black holes.
```


---

```markdown
## API Documentation: /api/enhance

### 1. Endpoint:
`/api/enhance`

### 2. Method(s):
`POST`

### 3. Description:
This endpoint accepts a text prompt as input and uses the Gemini AI model to enhance and refine it. The enhanced prompt is then returned as a text stream. This is designed to improve the clarity, detail, and effectiveness of user-provided prompts for use with other AI models or applications.

### 4. Request Body:
```json
{
  "prompt": "string"  // The prompt to be enhanced.  Must be a non-empty string.
}
```

### 5. Query Parameters:
None.

### 6. Response:
A text stream containing the enhanced prompt. The response is returned as `text/plain` content.  The text stream contains a single string representing the enhanced prompt. The prompt is wrapped in triple backticks which are removed by the API.

### 7. Status Codes:
*   **200 OK**: The prompt was successfully enhanced and the stream is being returned.
*   **400 Bad Request**: The request body is invalid, specifically the `prompt` is missing, not a string, or empty.
*   **500 Internal Server Error**: An unexpected error occurred on the server (e.g., Gemini API failure). *Note*: Specific error details from the Gemini API are not relayed.  It is up to the user to implement proper retry mechanisms and error handling.

### 8. Authentication:
Authentication is implicitly handled by the `NEXT_PUBLIC_GEMINI_API_KEY` environment variable. Ensure this variable is properly configured in your environment.  The existence of a valid API key is verified during server startup.

### 9. Example Request:

**cURL:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{ "prompt": "Write a short story." }' http://localhost:3000/api/enhance
```

**JavaScript (fetch):**

```javascript
async function enhancePrompt(prompt) {
  const response = await fetch('/api/enhance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += new TextDecoder().decode(value);
  }

  return result;
}

enhancePrompt("Write a short story.")
  .then(enhancedPrompt => console.log(enhancedPrompt))
  .catch(error => console.error('Error:', error));
```

### 10. Example Response:

The response will be a text stream.  Here's an example of what the *complete* response body, after the stream has been fully received, might look like (note that the backticks will have been stripped):

```text
Craft a compelling short story set in a bustling cyberpunk metropolis. The protagonist, a skilled hacker named Anya, discovers a hidden message within a heavily encrypted file. This message reveals a conspiracy that threatens the city's fragile balance of power. Develop the plot, including Anya's investigation, the challenges she faces from powerful corporations and ruthless hackers, and the ultimate resolution of the conspiracy.  Focus on creating a vivid atmosphere, memorable characters, and a suspenseful narrative with twists and turns.
```


---

```markdown
# /api/feedback API Documentation

## 1. Endpoint
`/api/feedback`

## 2. Method(s)
`POST`

## 3. Description
This endpoint allows authenticated users to submit feedback (positive or negative) on a specific prompt response. It checks for authentication, validates the feedback type, retrieves the user ID from the `users` table based on the email from the session, and saves the feedback to the `prompt_feedback` table. It also prevents duplicate feedback submissions for the same user and prompt.

## 4. Request Body
The request body should be a JSON object with the following structure:

```json
{
  "response": string, // The prompt response string to provide feedback on.
  "feedback": boolean // A boolean value indicating whether the feedback is positive (true) or negative (false).
}
```

*   `response`: (string, required) The prompt or response the user is giving feedback on.
*   `feedback`: (boolean, required)  `true` for positive feedback, `false` for negative feedback.

## 5. Query Parameters
None.

## 6. Response
The response is a JSON object indicating the success or failure of the feedback submission.

## 7. Status Codes

*   `200 OK`: Feedback successfully submitted.
*   `400 Bad Request`: Invalid feedback type (feedback is not a boolean).
*   `401 Unauthorized`: User is not authenticated or has no session.
*   `404 Not Found`: User not found in the `users` table.
*   `409 Conflict`: Feedback already submitted for the same user and prompt.
*   `500 Internal Server Error`: An unexpected error occurred during the process.

## 8. Authentication
Yes, authentication is required.  The user must have a valid `next-auth` session.

## 9. Example Request

**cURL:**

```bash
curl -X POST \
  http://localhost:3000/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{
    "response": "This is a sample response.",
    "feedback": true
  }'
```

**JavaScript (using `fetch`):**

```javascript
async function submitFeedback(response, feedback) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ response, feedback }),
  });

  const data = await res.json();
  return data;
}

// Example usage:
submitFeedback("This is a sample response.", true)
  .then(data => console.log(data));
```

## 10. Example Response

**Success (200 OK):**

```json
{
  "success": true
}
```

**Error - Unauthorized (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Error - Invalid Feedback Type (400 Bad Request):**

```json
{
  "success": false,
  "message": "Invalid feedback type"
}
```

**Error - User Not Found (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Error - Feedback Already Submitted (409 Conflict):**

```json
{
  "success": false,
  "message": "Feedback already submitted"
}
```

**Error - Internal Server Error (500 Internal Server Error):**

```json
{
  "success": false,
  "message": "Error saving feedback"
}
```
```json
{
    "success": false,
    "error": {} // Actual error object will be here.
}
```


---

```markdown
## API Documentation: /api/negative-feedback

### 1. Endpoint
`/api/negative-feedback`

### 2. Method(s)
`POST`

### 3. Description
This endpoint receives negative feedback related to a prompt and stores it in a Supabase database. The `prompt` field in the `prompt_feedback` table is populated with the `response` received in the request body, and the `feedback` field is set to `false` to indicate negative feedback.

### 4. Request Body
The request body should be a JSON object with the following structure:

```json
{
  "response": string
}
```

*   `response`:  A string containing the prompt that the user is providing negative feedback for.  This is the actual prompt text.

### 5. Query Parameters
None

### 6. Response
The API returns a JSON response indicating the success or failure of the operation.

### 7. Status Codes
*   `200 OK`:  Indicates successful insertion of the feedback into the database.
*   `500 Internal Server Error`: Indicates an error occurred during the process.  The `error` field in the response body will contain details about the error.

### 8. Authentication
This endpoint likely requires authentication, as it writes to a database.  It utilizes `supabaseAdmin`, which suggests it operates with admin privileges. While the provided code snippet doesn't explicitly show authentication middleware, its reliance on `supabaseAdmin` implies it is configured elsewhere in the application (e.g., through environment variables and server-side initialization of the Supabase client).  Therefore, proper Supabase admin credentials are required for successful operation.

### 9. Example Request

**cURL:**

```bash
curl -X POST \
  http://localhost:3000/api/negative-feedback \
  -H 'Content-Type: application/json' \
  -d '{
    "response": "The prompt was not helpful and produced irrelevant results."
  }'
```

**JavaScript (fetch):**

```javascript
const data = { response: "The prompt was too vague." };

fetch('/api/negative-feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
```

### 10. Example Response

**Success (200 OK):**

```json
{
  "success": true
}
```

**Error (500 Internal Server Error):**

```json
{
  "success": false,
  "error": {
    "code": "22001",
    "details": null,
    "hint": null,
    "message": "value too long for type character varying(255)"
  }
}
```


---

```markdown
# /api/positive-feedback API Documentation

## 1. Endpoint
`/api/positive-feedback`

## 2. Method(s)
`POST`

## 3. Description
This endpoint accepts a POST request containing user feedback, specifically a "response" field, and stores it in a Supabase database table named `prompt_feedback`.  The `feedback` column in the table is set to `true` to indicate positive feedback.

## 4. Request Body
The request body should be a JSON object with the following structure:

```json
{
  "response": string
}
```

*   `response` (string): The user's feedback or prompt that they are giving positive feedback on.

## 5. Query Parameters
None

## 6. Response
The API returns a JSON response indicating the success or failure of storing the feedback.

## 7. Status Codes
*   `200 OK`:  Indicates that the feedback was successfully stored in the database.
*   `500 Internal Server Error`: Indicates that there was an error storing the data in the database or some other unexpected error occurred. The error object will be included in the response.

## 8. Authentication
Authentication depends on the implementation of `supabaseAdmin`. The example provided assumes that `supabaseAdmin` is initialized with a service role key, thus bypassing RLS (Row Level Security) and not requiring explicit user authentication within the route. If `supabaseAdmin` is initialized with an API key, RLS will apply and may require the user to be authenticated.

## 9. Example Request

**cURL:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{ "response": "This is a great feature!" }' http://localhost:3000/api/positive-feedback
```

**JavaScript (fetch):**

```javascript
fetch('/api/positive-feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ response: 'This is very helpful.' }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## 10. Example Response

**Success (200 OK):**

```json
{
  "success": true
}
```

**Error (500 Internal Server Error):**

```json
{
  "success": false,
  "error": {
    "code": "42501",
    "details": null,
    "hint": null,
    "message": "new row violates row-level security policy for table \"prompt_feedback\""
  }
}
```

Or, in case of a generic error:

```json
{
  "success": false,
  "error": "Unexpected error message goes here"
}
```


---

```markdown
## API Documentation: /api/prompt/[id]/embed

### 1. Endpoint

`/api/prompt/[id]/embed`

### 2. Method(s)

`POST`

### 3. Description

This endpoint takes a prompt ID, fetches the corresponding prompt text from the database, generates an embedding for the text using `embedText` function, and then updates the prompt record in the database with the generated embedding.

### 4. Request Body

None. This endpoint does not expect a request body.

### 5. Query Parameters

None. This endpoint does not use query parameters.

### 6. Response

The response is a JSON object indicating the success or failure of the operation.  If successful, it returns `{ ok: true }`. If an error occurs, it returns an error message.

### 7. Status Codes

*   **200 OK**: The embedding was successfully generated and updated in the database.
*   **404 Not Found**: The prompt with the specified ID was not found.
*   **500 Internal Server Error**: An error occurred during embedding generation or database update.  The response body will contain the error message.

### 8. Authentication

Authentication is assumed to be required, as the code utilizes `supabaseAdmin`, suggesting administrative privileges are necessary to access and update the `prompts` table.

### 9. Example Request

```bash
curl -X POST http://localhost:3000/api/prompt/123/embed
```

or, using JavaScript:

```javascript
async function embedPrompt(id) {
  const response = await fetch(`/api/prompt/${id}/embed`, {
    method: 'POST',
  });

  const data = await response.json();

  if (response.ok) {
    console.log('Embedding successful:', data);
  } else {
    console.error('Embedding failed:', data);
  }
}

// Example Usage:
// embedPrompt("your-prompt-id");
```

### 10. Example Response

**Successful Response (200 OK):**

```json
{
  "ok": true
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Prompt not found"
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "error": "Database error:  insert or update on table \"prompts\" violates foreign key constraint \"prompts_user_id_fkey\" on table \"users\""
}
```


---

```markdown
# /api/prompt API Documentation

This document provides detailed information about the `/api/prompt` API endpoint.

## 1. Endpoint

`/api/prompt`

## 2. Method(s)

`POST`

## 3. Description

This endpoint accepts a text-based input and uses the `generatePrompt` function (presumably interfacing with a large language model like Gemini) to generate a prompt based on that input. It then returns the generated prompt.

## 4. Request Body

The request body should be a JSON object with the following structure:

```json
{
  "input": "string"
}
```

Where:

*   `input`:  **(string)** The text input to be used for prompt generation.

## 5. Query Parameters

None.

## 6. Response

The API returns a JSON object with the following structure:

```json
{
  "result": "string"
}
```

Where:

*   `result`: **(string)** The generated prompt.

## 7. Status Codes

*   **200 OK**:  The request was successful, and the generated prompt is returned.
*   **400 Bad Request**: The request body is invalid or missing required fields (e.g., the `input` field is missing).  Implied; the provided code doesn't explicitly handle this, but a robust implementation should.
*   **500 Internal Server Error**: An error occurred during prompt generation (e.g., a problem with the `generatePrompt` function or the underlying language model).  Implied; the provided code doesn't explicitly handle this, but a robust implementation should.

## 8. Authentication

Authentication is likely not required based on the code provided. However, this depends on the implementation details of the `generatePrompt` function. If `generatePrompt` relies on an authenticated service, then authentication would be necessary.  Without further context, we assume no authentication is required for this base example.

## 9. Example Request

**cURL:**

```bash
curl -X POST \
  http://localhost:3000/api/prompt \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "Write a short story about a cat who dreams of being a superhero."
  }'
```

**JavaScript (fetch API):**

```javascript
async function generatePrompt(input) {
  const response = await fetch('/api/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

// Example usage:
generatePrompt("Write a haiku about autumn leaves.").then(result => {
  console.log(result);
});
```

## 10. Example Response

```json
{
  "result": "Falling leaves descend,\nA tapestry of warm hues,\nWinter's slumber nears."
}
```


---

```markdown
## API Documentation: /api/prompt/vote

### 1. Endpoint:

`/api/prompt/vote`

### 2. Method(s):

`POST`

### 3. Description:

This endpoint allows users to register either a "like" or "dislike" vote for a specific prompt.  It increments the corresponding "likes" or "dislikes" count in the database for the given prompt ID.  The endpoint uses Supabase's `rpc` function to execute database procedures for incrementing the counts.

### 4. Request Body:

The request body should be a JSON object with the following properties:

```json
{
  "promptId": string,
  "type": "likes" | "dislikes"
}
```

*   `promptId`: (string, required) The unique identifier of the prompt to vote on.
*   `type`: (string, required)  The type of vote. Must be either `"likes"` or `"dislikes"`.

### 5. Query Parameters:

None

### 6. Response:

The endpoint returns a JSON object with a message indicating the success of the operation.

```json
{
  "message": string
}
```

### 7. Status Codes:

*   `200 OK`: Successfully registered the vote. The response message will be either `"likes registered"` or `"dislikes registered"`.
*   `400 Bad Request`: The request body is invalid, either missing required fields or the `type` field has an invalid value.  The response message will be `"Invalid data"`.
*   `500 Internal Server Error`: An error occurred on the server while processing the request.  The response message will be `"Server error"`.

### 8. Authentication:

This endpoint likely requires authentication, as it interacts with the database using `supabaseAdmin`.  The specific authentication method is not detailed in the provided code but is handled implicitly by the `supabaseAdmin` object which presumably has credentials available.

### 9. Example Request:

**cURL:**

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "promptId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "likes"
  }' \
  /api/prompt/vote
```

**JavaScript (fetch API):**

```javascript
async function vote(promptId, type) {
  const response = await fetch('/api/prompt/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ promptId, type }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Error voting:', data.message);
    return;
  }

  console.log('Vote registered:', data.message);
}

// Example usage:
vote("123e4567-e89b-12d3-a456-426614174000", "likes");
```

### 10. Example Response:

**Successful Like Registration:**

```json
{
  "message": "likes registered"
}
```

**Successful Dislike Registration:**

```json
{
  "message": "dislikes registered"
}
```

**Error Response (Invalid Data):**

```json
{
  "message": "Invalid data"
}
```

**Error Response (Server Error):**

```json
{
  "message": "Server error"
}
```


---

```markdown
# /api/prompt-library API Documentation

## 1. Endpoint
`/api/prompt-library`

## 2. Method(s)
*   `POST`
*   `GET`

## 3. Description

This API endpoint allows users to add new prompts to the prompt library (using `POST`) and retrieve all prompts from the library (using `GET`).

## 4. Request Body (POST)

The `POST` method expects a JSON payload with the following structure:

```json
{
    "userId": "string",
    "title": "string",
    "description": "string",
    "promptText": "string",
    "niche": "string"
}
```

*   `userId`:  ID of the user creating the prompt (string).
*   `title`: Title of the prompt (string).
*   `description`: Description of the prompt (string).
*   `promptText`: The actual prompt text (string).
*   `niche`: The specific niche or category the prompt belongs to (string).

## 5. Query Parameters

None

## 6. Response

**POST Response:**

On successful prompt creation:

```json
{
    "message": "Prompt Added to Library Saved Successfully"
}
```

On error:

```json
{
    "message": "string" // Error message. E.g., "Missing Data" or error from supabase.
}
```

**GET Response:**

On successful retrieval, returns an array of prompt objects:

```json
[
  {
    "id": 1,
    "created_by": "user123",
    "prompt_title": "Marketing Campaign Prompt",
    "prompt_description": "Prompt to generate marketing campaigns",
    "promptText": "Write a marketing campaign for...",
    "niche": "Marketing",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "created_by": "user456",
    "prompt_title": "Code Generation Prompt",
    "prompt_description": "Prompt to generate some code",
    "promptText": "Write some javascript code...",
    "niche": "Coding",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

On error:

```json
{
    "error": "string" // Error message. E.g., "Internal Server Error" or specific Supabase error.
}
```

## 7. Status Codes

*   **200 OK**: Successful operation (prompt added or prompts retrieved).
*   **400 Bad Request**: Missing required data in the request body for `POST`.
*   **500 Internal Server Error**: An unexpected error occurred on the server. Supabase errors also result in a 500 status code.

## 8. Authentication

Implicit: The code assumes `supabaseAdmin` is properly initialized with admin credentials, allowing it to interact with the database without user-level authentication. However, in a production environment, consider the security implications and implement proper authentication and authorization to protect sensitive data and prevent unauthorized access.  A user ID is required for the POST request implying some degree of user context should be established prior to creating prompts.

## 9. Example Request

**POST (cURL):**

```bash
curl -X POST \
  http://localhost:3000/api/prompt-library \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user123",
    "title": "New Prompt",
    "description": "A test prompt",
    "promptText": "This is the prompt text.",
    "niche": "Testing"
  }'
```

**GET (JavaScript using `fetch`):**

```javascript
fetch('/api/prompt-library')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 10. Example Response

**POST (Success):**

```json
{
    "message": "Prompt Added to Library Saved Successfully"
}
```

**GET (Success):**

```json
[
    {
        "id": 1,
        "created_by": "user123",
        "prompt_title": "Example Prompt",
        "prompt_description": "This is an example prompt description.",
        "promptText": "Write a short story about...",
        "niche": "Fiction",
        "created_at": "2023-10-27T10:00:00.000Z"
    }
]
```
```

---

```markdown
## API Endpoint Documentation: /api/recommend

### 1. Endpoint:
`/api/recommend`

### 2. Method(s):
`POST`

### 3. Description:
This endpoint retrieves recommended prompts based on a provided query text or embedding. It uses Supabase's `match_prompts` RPC function for an initial search and then performs post-filtering based on various criteria like excluding a specific ID, filtering by creator, category, and minimum similarity score.

### 4. Request Body:

The request body should be a JSON object with the following properties:

```typescript
type Payload = {
    queryText?: string;       // Text to embed and use for similarity search
    queryEmbedding?: number[]; // Pre-computed embedding vector (optional, use queryText if not provided)
    excludeId?: string;        // ID of a prompt to exclude from the results
    limit?: number;          // Maximum number of results to return (default: 6)
    createdBy: string;         // Filter results to only include prompts created by this user
    category?: string;       // Filter results by category (optional)
    minSimilarity?: number;   // Minimum similarity score (0..1) for a prompt to be included (default: 0.2)
}
```

| Property       | Type       | Description                                                                                                                                                              | Required | Default |
|----------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------|
| `queryText`    | `string`   | The text query used to generate an embedding for the similarity search. Either `queryText` or `queryEmbedding` must be provided.                                         | Optional |         |
| `queryEmbedding` | `number[]` | A pre-calculated embedding vector. If provided, `queryText` is ignored. Either `queryText` or `queryEmbedding` must be provided.                                       | Optional |         |
| `excludeId`    | `string`   | The ID of a prompt to exclude from the results.                                                                                                                       | Optional |         |
| `limit`        | `number`   | The maximum number of recommended prompts to return.                                                                                                                   | Optional | `6`     |
| `createdBy`    | `string`   | The user ID of the prompt creator to filter the results by.  This field is mandatory for filtering by a specific user's prompts.                                       | Required |         |
| `category`     | `string`   | The category to filter the prompts by.                                                                                                                                 | Optional |         |
| `minSimilarity`| `number`   | The minimum similarity score (between 0 and 1) that a prompt must have to be included in the results.  Lower values return more results, possibly of lower quality. | Optional | `0.2`   |


### 5. Query Parameters:
None

### 6. Response:

The response is a JSON object with a `results` property containing an array of recommended prompts. Each prompt object in the array contains the properties returned by the Supabase `match_prompts` function, plus a `similarity` score. The specific fields of a prompt object depend on the `match_prompts` function implementation in Supabase.

```typescript
{
    results: [
        {
            id: string;
            created_at: string;
            created_by: string;
            text: string;
            embedding: number[];
            category?: string;
            similarity: number;
            // ... other fields depending on your data structure
        },
        // ... more prompts
    ]
}
```

### 7. Status Codes:

*   `200 OK`: Successfully retrieved recommended prompts.
*   `400 Bad Request`: `queryText` or `queryEmbedding` is missing in the request body.
*   `500 Internal Server Error`: An error occurred while querying the database (Supabase).

### 8. Authentication:

The code uses `supabaseAdmin`, which implies that this endpoint likely requires server-side authentication or authorization to access the Supabase database with admin privileges.  It is important to properly secure `supabaseAdmin` to prevent unauthorized access.

### 9. Example Request:

**cURL:**

```bash
curl -X POST \
  http://localhost:3000/api/recommend \
  -H 'Content-Type: application/json' \
  -d '{
    "queryText": "Generate an image of a futuristic city",
    "createdBy": "user123",
    "limit": 5,
    "minSimilarity": 0.3
  }'
```

**JavaScript (fetch API):**

```javascript
const payload = {
  queryText: "Generate an image of a futuristic city",
  createdBy: "user123",
  limit: 5,
  minSimilarity: 0.3
};

fetch('/api/recommend', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => console.log(data));
```

### 10. Example Response:

```json
{
  "results": [
    {
      "id": "prompt1",
      "created_at": "2023-10-27T10:00:00.000Z",
      "created_by": "user123",
      "text": "Create a stunning cityscape of the future.",
      "embedding": [0.1, 0.2, 0.3, 0.4, 0.5],
      "similarity": 0.8,
      "category": "image generation"
    },
    {
      "id": "prompt2",
      "created_at": "2023-10-26T14:30:00.000Z",
      "created_by": "user123",
      "text": "Design a futuristic urban landscape.",
      "embedding": [0.5, 0.4, 0.3, 0.2, 0.1],
      "similarity": 0.7,
      "category": "image generation"
    }
  ]
}
```


---

```markdown
# /api/save-prompt

## Endpoint
`/api/save-prompt`

## Method(s)
`POST`

## Description
This endpoint saves a user-generated prompt to a database using Supabase. It expects a `userId`, `prompt`, and optionally an `originalPrompt` in the request body.

## Request Body
The request body should be a JSON object with the following structure:

```json
{
  "userId": string,
  "prompt": string,
  "originalPrompt"?: string
}
```

| Key             | Type   | Description                                    | Required |
|-----------------|--------|------------------------------------------------|----------|
| `userId`        | string | The unique identifier of the user creating the prompt. | Yes      |
| `prompt`        | string | The generated prompt text to be saved.          | Yes      |
| `originalPrompt`| string | The original prompt, if applicable (e.g. pre-edited by user) | No      |

## Query Parameters
None

## Response
The endpoint returns a JSON response indicating the success or failure of the prompt saving operation.

## Status Codes

| Status Code | Description                                                    |
|-------------|----------------------------------------------------------------|
| `200`       | Success. Indicates that the prompt was saved successfully.        |
| `400`       | Bad Request. Indicates that required data (`userId` or `prompt`) is missing in the request body. |
| `500`       | Internal Server Error. Indicates an unexpected error occurred during the process. |

## Authentication
This endpoint requires authentication. It assumes you have `supabaseAdmin` configured to handle authentication when accessing the database.

## Example Request

**cURL:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "userId": "user123",
  "prompt": "A beautiful sunset over a mountain range.",
  "originalPrompt": "sunset mountain"
}' /api/save-prompt
```

**JavaScript (using `fetch`):**

```javascript
async function savePrompt(userId, prompt, originalPrompt) {
  const response = await fetch('/api/save-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, prompt, originalPrompt }),
  });

  const data = await response.json();
  return data;
}

// Example usage
savePrompt('user123', 'A beautiful sunset over a mountain range.', 'sunset mountain');
```

## Example Response

**Success (Status 200):**

```json
{
  "message": "Prompt Saved Successfully"
}
```

**Bad Request (Status 400):**

```json
{
  "message": "Missing Data"
}
```

**Internal Server Error (Status 500):**

```json
{
  "message": "Error message from the server"
}
```


---

```markdown
# /api/save-prompt-score

## 1. Endpoint
`/api/save-prompt-score`

## 2. Method(s)
`POST`

## 3. Description
This endpoint saves a prompt and its associated scores (clarity, specificity, model fit, relevance, structure, and conciseness) to a Supabase database. It's designed to allow users to submit their prompt scoring for analysis or future use.

## 4. Request Body
The request body should be a JSON object with the following properties:

```json
{
  "userId": string,
  "prompt": string,
  "clarity": number,
  "specificity": number,
  "model_fit": number,
  "relevance": number,
  "structure": number,
  "conciseness": number
}
```

| Property    | Type   | Description                                             | Required |
|-------------|--------|---------------------------------------------------------|----------|
| `userId`    | string | The ID of the user submitting the prompt.               | Yes      |
| `prompt`    | string | The prompt text.                                       | Yes      |
| `clarity`   | number | Score representing the clarity of the prompt.           | No       |
| `specificity`| number | Score representing the specificity of the prompt.        | No       |
| `model_fit` | number | Score representing how well the prompt fits the model.   | No       |
| `relevance` | number | Score representing the relevance of the prompt.        | No       |
| `structure` | number | Score representing the structure of the prompt.         | No       |
| `conciseness`| number | Score representing the conciseness of the prompt.        | No       |

## 5. Query Parameters
None.

## 6. Response

**Successful Response:**

```json
{
  "message": "Prompt Saved Successfully"
}
```

**Error Response:**

```json
{
  "message": "Missing Data"
}
```

Or:

```json
{
  "message": "Internal server error"
}
```

## 7. Status Codes

| Status Code | Description                                                     |
|-------------|-----------------------------------------------------------------|
| `200`       | OK. The prompt and scores were successfully saved.                |
| `400`       | Bad Request. Missing required data in the request body (userId or prompt). |
| `500`       | Internal Server Error. An error occurred on the server.          |

## 8. Authentication
Authentication is assumed to be handled elsewhere, as the `userId` is passed in the request body. The Supabase client library (`supabaseAdmin`) should be initialized with a service role key or similar privileged access to bypass RLS (Row Level Security) and allow writing to the `prompt_scores` table.

## 9. Example Request

**cURL:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "userId": "user123",
  "prompt": "Explain the theory of relativity.",
  "clarity": 4,
  "specificity": 3,
  "model_fit": 5,
  "relevance": 5,
  "structure": 4,
  "conciseness": 3
}' http://localhost:3000/api/save-prompt-score
```

**JavaScript (using `fetch`):**

```javascript
const data = {
  userId: "user123",
  prompt: "Explain the theory of relativity.",
  clarity: 4,
  specificity: 3,
  model_fit: 5,
  relevance: 5,
  structure: 4,
  conciseness: 3
};

fetch('/api/save-prompt-score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
```

## 10. Example Response

**Successful Response (Status 200):**

```json
{
  "message": "Prompt Saved Successfully"
}
```

**Error Response (Status 400):**

```json
{
  "message": "Missing Data"
}
```

**Error Response (Status 500):**

```json
{
  "message": "Internal server error"
}
```


---

```markdown
# /api/score-prompt API Documentation

This document describes the `/api/score-prompt` Next.js API route.

## 1. Endpoint

`/api/score-prompt`

## 2. Method(s)

`POST`

## 3. Description

This endpoint takes a user-provided prompt as input and uses the Gemini model to evaluate its quality. It returns an overall score, individual criteria scores (clarity, specificity, model_fit, relevance, structure, conciseness), and feedback for improvement.

## 4. Request Body

The request body should be a JSON object with a single field:

```json
{
  "prompt": string
}
```

*   `prompt` (string, required): The prompt to be evaluated.

## 5. Query Parameters

This endpoint does not accept any query parameters.

## 6. Response

The response is a JSON object with the following structure:

```json
{
  "overallScore": number,
  "criteriaScores": {
    "clarity": number,
    "specificity": number,
    "model_fit": number,
    "relevance": number,
    "structure": number,
    "conciseness": number
  },
  "feedback": string
}
```

*   `overallScore` (number): The overall quality score of the prompt, as a percentage (0-100).
*   `criteriaScores` (object): An object containing individual scores (1-10) for each criteria.
    *   `clarity` (number): Score for clarity.
    *   `specificity` (number): Score for specificity.
    *   `model_fit` (number): Score for model fit.
    *   `relevance` (number): Score for relevance.
    *   `structure` (number): Score for structure.
    *   `conciseness` (number): Score for conciseness.
*   `feedback` (string): A brief suggestion for improvement or a message indicating no improvement is needed.

## 7. Status Codes

*   `200 OK`: The request was successful, and the response body contains the prompt evaluation results.
*   `500 Internal Server Error`: An error occurred during the evaluation process. The response body contains an error message. Common causes include issues connecting to the Gemini API or an invalid response format from Gemini.

## 8. Authentication

No authentication is required. However, the `NEXT_PUBLIC_GEMINI_API_KEY` environment variable must be set for the endpoint to function.

## 9. Example Request

**cURL:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{ "prompt": "Write a poem about a cat." }' http://localhost:3000/api/score-prompt
```

**JavaScript (fetch):**

```javascript
const prompt = "Write a poem about a cat.";

fetch('/api/score-prompt', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompt })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 10. Example Response

```json
{
  "overallScore": 78,
  "criteriaScores": {
    "clarity": 8,
    "specificity": 6,
    "model_fit": 9,
    "relevance": 8,
    "structure": 9,
    "conciseness": 7
  },
  "feedback": "Add more specific instructions to improve the specificity score."
}
```


---

