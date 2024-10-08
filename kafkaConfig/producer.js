



const { Kafka } = require("./client");

async function kafkaProducer() {
  let producer;

  try {
    producer = Kafka.producer();



    await producer.connect();


    await producer.send({
      topic: 'rider-updates',
      messages: [
        { partition: 0, key: 'location-update', value: JSON.stringify({ name: 'Tony Stark', loc: 'America' }) }
      ],
    });


  } catch (error) {
    console.error(`Error occurred: ${error}`);
  } finally {
    if (producer) {
      await producer.disconnect();

    }
  }
}


module.exports = kafkaProducer;