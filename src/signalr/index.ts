import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class SignalRConnection {
    constructor() {
        if (SignalRConnection.instance) {
            return SignalRConnection.instance;
        }

        this.connection = null;
        this.isConnected = false;
        SignalRConnection.instance = this;
    }

    // Initialize connection
    init(url) {
        if (this.connection) {
            return;
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(url)
            .configureLogging(LogLevel.Information)
            .build();

        // Start the connection
        this.connection
            .start()
            .then(() => {
                console.log('SignalR connected');
                this.isConnected = true;
            })
            .catch((err) => {
                console.error('SignalR connection error: ', err);
                this.isConnected = false;
            });

        // Event listener for when the connection is closed
        this.connection.onclose((error) => {
            this.isConnected = false;
            console.log('SignalR connection closed:', error);
        });
    }

    // Send message to SignalR hub
    sendMessage(method, ...args) {
        if (this.isConnected && this.connection) {
            this.connection.invoke(method, ...args)
                .catch((err) => {
                    console.error(`SignalR invoke method error: ${err}`);
                });
        } else {
            console.log('SignalR not connected');
        }
    }

    // Listen to messages from the SignalR hub
    onMessage(method, callback) {
        if (this.connection) {
            this.connection.on(method, callback);
        }
    }

    // Stop the connection
    stopConnection() {
        if (this.connection) {
            this.connection.stop().then(() => {
                this.isConnected = false;
                console.log('SignalR connection stopped');
            });
        }
    }

    getConnection() {
        return this.connection;
    }
}

export default new SignalRConnection();
