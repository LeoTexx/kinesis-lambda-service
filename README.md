# Kinesis Handler

This AWS Kinesis event handler service is designed to process and react to various types of events published to a Kinesis stream. It utilizes the Command Query Responsibility Segregation (CQRS) pattern to separate the reading and update operations for improved scalability and maintainability. The service features an AWS Kinesis client for event publishing and supports both DynamoDB and in-memory storage for event data persistence.

## Installation

You can set up the project in different ways, depending on your development environment and preferences. Ensure you select the appropriate storage mechanism by configuring the `USE_DYNAMO_DB` environment variable in the `.env` file based on your choice between DynamoDB and in-memory storage.

### Docker Compose

For a straightforward setup, including the service and a local Kinesis stream:

```sh
docker-compose up --build
```

This setup is intended for local development, with event publishing disabled by default.

### Manual Setup

To manually install dependencies and run the service:

```sh
npm install
npm run dev
```

## Usage

The service listens to a Kinesis stream and processes incoming events based on their types. Operations on the configured storage (DynamoDB or in-memory) are performed accordingly. The design allows for switching between storage options and extending the service to handle additional event types.

## Architectural Decisions

### CQRS Pattern

The service implements the Command Query Responsibility Segregation (CQRS) pattern, separating command operations (writes) from query operations (reads). This approach:

- **Improves Performance:** By separating read and write models, the system can scale and optimize each operation type independently.
- **Increases Flexibility:** Different models for reading and writing facilitate the optimization of each operation without impacting the other.
- **Enhances Maintainability:** Clear separation of concerns makes the system easier to understand, modify, and extend.

### Commands and Event Handling

Commands are separated into distinct classes (`CreateUserLimit`, `UpdateUserLimitProgress`, `ResetUserLimit`), each responsible for handling specific types of user limit operations. This separation:

- **Encourages Single Responsibility Principle:** Each command class has a single responsibility, making the codebase cleaner and easier to maintain.
- **Facilitates Extensibility:** Adding new command types or modifying existing ones is simplified, promoting system evolution without extensive refactoring.
- **Supports Complex Workflows:** The distinct command classes can encapsulate complex business logic, allowing for sophisticated processing flows.

### Repository Pattern

The use of the Repository pattern for data access abstracts the underlying storage mechanism (DynamoDB or in-memory), enabling:

- **Storage Interchangeability:** Switching between different storage technologies can be done with minimal impact on the rest of the application.
- **Decoupling of Business Logic and Data Access:** Business logic remains independent of how data is stored or retrieved, fostering cleaner, more modular code.
- **Simplified Data Access:** The repository interface provides a simplified, consistent access pattern for querying and updating data, regardless of the storage backend.

## Future Enhancements

### Database Flexibility

While the service currently supports DynamoDB and in-memory storage, future enhancements could include support for additional databases, further increasing flexibility and scalability.

### Extending Event Types

The architecture is designed for easy extension to support new event types and entities. This ensures the service can grow and adapt to new requirements over time.

## Q&A

### 1. What did you like about the task and what didn’t? Can we improve it and how?

I appreciated the challenge of engaging with AWS Kinesis, offering a rich comparative experience against my background with Azure's event-driven architecture and the CQRS packages in NestJS. This task provided a valuable platform for delving into the nuances of different event management solutions across cloud services, enabling a deeper understanding of the operational differences and integration capabilities between Kinesis and other message queuing services like AWS SQS. Attempting to simulate these processes in a local environment added an extra layer of complexity and learning.

However, the assignment could be further enhanced by improving the clarity and comprehensiveness of the documentation, particularly in explaining the role and structure of the events.json file and in guiding the handling of edge cases, such as duplicate events or out-of-order event reception. A more detailed elaboration on the treatment of these scenarios would greatly aid in developing more robust solutions. Additionally, outlining the expected scale and performance benchmarks could provide clearer direction for candidates, ensuring solutions are not only technically accurate but also optimized for scalability and efficiency. Incorporating a simple test suite or offering testing guidelines could significantly contribute to ensuring the reliability and quality of submissions, helping candidates to better validate their implementations against real-world scenarios.

### 2. If you were asked to change it so the UserLimit entries are stored on a database with a primary goal to provide them back to the front-end for display, which one would you suggest and why? What sub-tasks you would see as a necessary if you were asked to write a story for such change?

I would suggest using a NoSQL database like Amazon DynamoDB for storing UserLimit entries. DynamoDB is highly scalable, supports quick read and write operations, and integrates seamlessly with AWS Lambda and Kinesis. Its flexible schema would accommodate the dynamic nature of user limits and their progress without requiring schema migrations.

**Sub-tasks:**

- Schema Design: Define the DynamoDB table structure, including partition and sort keys (e.g., userId and limitType).
- Data Access Layer Implementation: Implement a data access layer in TypeScript to abstract DynamoDB operations, such as creating, updating, and resetting user limits.
- Integration with Lambda: Modify the Lambda function to write to DynamoDB upon processing events.
- Testing: Develop unit and integration tests to ensure the system behaves correctly with the database integration.
- Monitoring and Optimization: Set up monitoring for the DynamoDB table and optimize its performance (e.g., adjust read/write capacity units based on load).

### 3. What you would suggest for an API to return this data to the front-end for a user? What would be the API signature?

I would suggest an RESTful API implemented with AWS API Gateway and Lambda functions, returning JSON responses.

**API Signature Example:**

- **Endpoint:** `GET /user/{userId}/limits`
- **Response:**

```json
{
	"userId": "12345",
	"limits": [
		{
			"limitType": "daily",
			"limitValue": 100,
			"progress": 50
		},
		{
			"limitType": "monthly",
			"limitValue": 1000,
			"progress": 450
		}
	]
}
```

This endpoint would retrieve all limit settings and their current progress for a given user. It's designed to be straightforward for frontend applications to consume and display the user's limits.

### 4. How did/could you implement it so it’s possible to re-use it for other similar use cases?

To ensure our solution is scalable, maintainable, and adaptable for future enhancements or changes in storage mechanisms, we've employed an interface-based repository pattern. This approach allows our service to remain implementation-agnostic, meaning it can interact with different types of databases or storage systems without requiring significant changes to the business logic. Currently, our system supports both an in-memory implementation for rapid prototyping and testing, and a DynamoDB implementation for persistent storage. This flexibility is particularly beneficial in a microservices architecture where different services might have varying storage requirements or when transitioning from a monolithic to a microservices architecture.

Moreover, we leverage dependency injection to instantiate our repositories, which further decouples the system components and enhances testability. Dependency injection allows us to inject mock dependencies during testing, simplifying the process of writing unit tests and ensuring that our tests are not dependent on external systems like databases.

For example, in our AWS Kinesis handler implementation, the choice between DynamoDB and in-memory storage can be configured through environment variables, allowing for easy switching between the two based on the deployment environment or specific requirements. This setup not only demonstrates a practical application of the repository pattern and dependency injection but also aligns with best practices in software development by promoting loose coupling and high cohesion.

By abstracting the data access layer through interfaces and utilizing dependency injection for repository instantiation, we've created a system that is robust, easily testable, and ready to adapt to changes, whether they involve switching storage solutions or integrating additional services. This design philosophy ensures that our application remains agile and can evolve alongside the technological landscape or business needs.

## Conclusion

This Kinesis event handler service exemplifies the application of the CQRS pattern and other architectural principles to create a scalable, maintainable, and extensible system. The separation of commands, use of the Repository pattern, and careful architectural decisions underpin its robust design, making it well-suited for processing and reacting to events in a cloud environment.
