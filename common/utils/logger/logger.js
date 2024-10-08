const pino = require('pino');
const config = require('config');
const fs = require('fs');
const { setInterval } = require('timers');



const options = {
    useLevelLabels: true,
    level: 'info',
    timestamp: () => {
        return ', "time":"' + new Date().toLocaleString() + "\"";
    },
    messageKey: 'message',
    redact: {
        paths: ['pid', 'hostname', 'endpointName', 'password'],
        remove: true,
    },
    formatters: {
        level(label) {
            return { level: label };
        }
    },
};




const logDirectory = config.get('logging.base_path');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}


function getLogFileName(channel, properties) {
    const now = new Date();
    const hour = now.getHours();
    const dateStr = now.toISOString().slice(0, 10); // Get date in format 'YYYY-MM-DD'
    const datedChannel = channel && properties.endpointName ? channel + '-' + properties.endpointName + '-' + dateStr : "SERVER"; // Append system date to channel
    return `${logDirectory}/${datedChannel || channel}-${hour}.log`;
}


function rotateLogFile(logger, channel, properties) {
    const newLogFileName = getLogFileName(channel, properties);
    const currentStream = logger[Symbol.for('dest')];

    if (currentStream && currentStream.path !== newLogFileName) {
        currentStream.end();
        const newStream = fs.createWriteStream(newLogFileName, { flags: 'a' });
        logger[Symbol.for('dest')] = newStream;
    }
}


const pinoInstance = (channel, properties) => {
   
    const formattedChannel = channel && properties ? channel.toUpperCase() : null;
   
    if (formattedChannel) {
      
        if (!pinoInstance[formattedChannel] ) {
          
          
                pinoInstance[formattedChannel] = pino(options, fs.createWriteStream(getLogFileName(formattedChannel, properties), { flags: 'a' }));
            
    
        }
        if (options.level === 'info') {
            pinoInstance[formattedChannel] = pino(options, fs.createWriteStream(getLogFileName(formattedChannel, properties), { flags: 'a' }));
        }
        if (options.level === 'debug') {
            pinoInstance[formattedChannel] = pino(options, fs.createWriteStream(getLogFileName(formattedChannel, properties), { flags: 'a' }));
        }
      
        return pinoInstance[formattedChannel];
    } else {
      
        if (!pinoInstance.default) {
         
            pinoInstance.default = pino(options, fs.createWriteStream(getLogFileName(null, null), { flags: 'a' }));
        }
      
        return pinoInstance.default;
    }
};


const pinoChildInstance = (channel, properties) => {
    const logger = pinoInstance(channel, properties);
    return logger.child(properties);
};


function fileNameFormatter(channel, properties) {
    const formattedChannel = channel && properties.endpointName ? channel + '-' + properties.endpointName + '-' + new Date().toISOString().split('T')[0] : "SERVER"; // Append system date to channel
    return formattedChannel;
}


function CommonDebugLogger(headers, fileName) {
    return pinoChildInstance(headers["xChannelId"], {
        reqId: headers["xReqId"],
        fileName: fileName,
        TopicName: "Test-Topic",
        Partition: "Test-Partition",
        endpointName: headers['xEndpoint']
    });
}

// Rotate log files every hour
setInterval(() => {
    const channels = Object.keys(pinoInstance);
    channels.forEach(channel => {
        rotateLogFile(pinoInstance[channel]);
    });
}, 3600000); // 3600000 milliseconds = 1 hour


// Endpoint to change log level dynamically for 1 minute

const changed = async(req, res) => {
    const { newLevel } = req.body;
    
    if (newLevel && (newLevel === 'info' || newLevel === 'debug')) {
        const prevLevel = options.level;
        options.level = newLevel;
       
     
       
        res.send(`Log level changed to ${newLevel} for 1 minute.`);
        setTimeout(async() => {
            options.level = prevLevel;
         
       
        
        }, 60000); // Revert to previous log level after 1 minute
       
    } else {
        res.status(400).send('Invalid log level');
    }
};

module.exports = {
    pinoInstance,
    pinoChildInstance,
    CommonDebugLogger,
    changed
};
