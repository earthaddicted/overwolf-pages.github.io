const comeetToken = '1B16C4BD7005131B1A26F391B1';
const comeetID = 'B1.001';
const comeetJobsLink = `https://www.comeet.co/careers-api/2.0/company/${comeetID}/positions?token=${comeetToken}&details=true`;


fetchJobsList();

function insertJobsList(jobsJson) {
    jobsJson.then(jobsList => {
            console.log('jobsList', jobsList);
            if(jobsList) {
                const jobsBlockElement = document.getElementById('jobs-block');
                const jobsElements = document.createDocumentFragment();
                jobsList.forEach(job => {
                    const jobElement = document.createElement('div');
                    jobElement.className = 'jobs__item';
                    jobElement.innerHTML = getJobTemplate(job);
                    jobsElements.appendChild(jobElement);
                });
                jobsBlockElement.appendChild(jobsElements);
            }
        });
}

function fetchJobsList () {
    fetch(comeetJobsLink)
        .then(jobsResponse => {
            if(jobsResponse.ok) {
                insertJobsList(jobsResponse.json());
            }
        });
}

function getJobTemplate(job) {
    let country = '';
    if(job.location && job.location.country === 'IL') {
        country = 'Israel';
    }
    const city = job.location ? job.location.city : '';
    const locationElement = city || country ? `<span class="jobs__location">${city}, ${country}</span>` : '';
    job.employment_type = job.employment_type ? job.employment_type : "Full-time";
    job.experience_level = job.experience_level ? `<span class="jobs__level">${job.experience_level}</span>` : '';
    let descrTagsFree = tagsFree(job.details[0].value);
    descrTagsFree = descrTagsFree && descrTagsFree.length > 300 ? descrTagsFree.substring(0, 300) + '...' : descrTagsFree;
    const formatedName = job.name.replace(/\s+/g, '-').toLowerCase();
    return `<div class="jobs__item-top">
                            <span class="jobs__item-title">
                                ${job.name}
                            </span>
                        </div>
                        <div class="jobs__item-container">
                            <div class="jobs__info">
                                ${locationElement}
                                <span class="jobs__type">
                                    ${job.employment_type}
                                </span>
                                ${job.experience_level}
                            </div>
                            <p class="jobs__description">
                                ${descrTagsFree}
                            </p>
                            <a href="career-inner_template.html?uid=${job.uid}&job=${formatedName}" class="btn__transparent">
                                View full details
                            </a>
                        </div>`
}

function tagsFree(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}
