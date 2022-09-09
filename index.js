const cron = require('node-cron');
const express = require('express');
const Database = require('./helpers/database.js');
const Email = require('./helpers/email.js');

const app = express();

cron.schedule('* * * * *', async () => {
    //console.log("Runnig in every minute");
    const jobName = 'Email_Send';
    console.info(jobName + ': STARTING');

    const allUsers = await Database.User
                .find()
                .exec()
                .catch((error) => { console.error(error.message) });

    const allEmailUsers = await Database.allEmailUsers
        .find()            
        .exec()
        .catch((error) => { console.error(error.message) });

    for(const user of allEmailUsers){
        console.info(jobName + ': User');
        console.info(user);

        try{
            const matchingUsers = allUsers.filter(u => user.location == "NY");
            console.info(matchingUsers);

            let emailHTML = '';
            for(const mathcingUser of matchingUsers){
                jobHTML += `<br\>;
                <b>` + mathcingUser.name + '</b> ' + mathcingUser.location + `<br/>`;
            }

            await Email.send(
                user.emailId,
                'You got notification from Scheduler',
                'Check this new offers',
                Email.temp.jobName
                {
                    users: jobHTML
                })
                .then(() => {}, e => console.error('Email error:' + error.message))
                .catch(error => console.error(error.message));
        } catch(error){
            console.error(error.message);
        };
    }    
          console.info(user + ' : END');
});

app.listen(3000);