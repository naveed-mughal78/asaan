const { Kafka } = require("./client.js");

async function init() {
    const admin = Kafka.admin();

    admin.connect();



    await admin.createTopics({
        topics: [
            {
                topic: "rider-updates",
                numPartitions: 2,
            },
        ],
    });

    await admin.disconnect();
}

init();