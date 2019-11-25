const searchParams = new URLSearchParams(window.location.search);
const jobUID = searchParams.get('uid');
const comeetToken = '1B16C4BD7005131B1A26F391B1';
const comeetID = 'B1.001';
const jobDetailsUrl = `https://www.comeet.co/careers-api/2.0/company/${comeetID}/positions/${jobUID}?token=${comeetToken}&details=true`;

fetchJobDetails();

function fetchJobDetails() {
    fetch(jobDetailsUrl)
        .then(jobResponse => {
            if(jobResponse.ok) {
                jobResponse.json().then(jobDetails =>insertJobDetails(jobDetails));
            }
        });
}


function insertJobDetails(jobDetails) {
    if(!jobUID) {
        window.location.replace('/career_template.html');
        return;
    }
    const jobTitleElement = document.getElementById('job-title');
    const jobInfoElement = document.getElementById('job-info');
    const jobDetailsElement = document.getElementById('job-details');
    const mailtoElement = document.getElementById('mailto');
    let jobDetailsHtml = "";


    jobTitleElement.innerHTML = jobDetails.name;
    jobInfoElement.innerHTML = getJobInfoTemplate(jobDetails);
    jobDetails.details.forEach(detailsPart => {
        if(detailsPart.value) {
            detailsPart.value = detailsPart.value.replace(/(<p><br><\/p>)+/g, '');
            jobDetailsHtml += `<h3>${detailsPart.name}</h3> ${detailsPart.value}`;
        } else {
            jobDetailsHtml = '';
        }
    });
    jobDetailsElement.innerHTML = jobDetailsHtml;
    mailtoElement.href = `mailto:${jobDetails.email}`;
    mailtoElement.innerText = jobDetails.email;
}

function getJobInfoTemplate(job) {
    let country = '';
    if(job.location && job.location.country === 'IL') {
        country = 'Israel';
    }
    const city = job.location ? job.location.city : '';
    const locationElement = city || country ? `<span class="jobs__location">${city}, ${country}</span>` : '';
    job.employment_type = job.employment_type ? job.employment_type : "Full-time";
    job.experience_level = job.experience_level ? `<span class="jobs__level">${job.experience_level}</span>` : '';
    return `
                    ${locationElement}
                    <span class="jobs__type">
                        ${job.employment_type}
                    </span>
                     ${job.experience_level}`
}

//Apply form methods:

window.OW = window.OW || {};

OW.careers = {
    filesAllowed : ['.pdf', '.doc', '.docx'],
    initForm: function() {
        const formElement = document.getElementById('apply-form');
        if ( ! formElement )
            return;

        const errorMsgElements = document.querySelectorAll('.err-msg');
        errorMsgElements.forEach(errEl => {
            const formField = errEl.previousElementSibling;
            formField.addEventListener('focus', () => {
                errEl.textContent = '';
                errEl.style.display = 'none';
            });
        });


        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const formValid = this.formValidation(formElement);
            if ( formValid )
                this.formSend(formElement);

            return false;
        });

        this.initFileUpload();
    },
    formSend: function(form) {
        var url = `https://www.comeet.co/careers-api/1.0/company/B1.001/positions/${jobUID}/apply?token=1B16C4BD7005131B1A26F391B1`;

        document.getElementById('apply-form-error').innerText = '';

        fetch(url, {
            body: new FormData(form),
            cache: 'no-cache',
            method: 'POST',
        }).then(sendFormResponse => {
            if(sendFormResponse.ok) {
                this.onFormSuccess();
            } else {
                sendFormResponse.json().then(sendFormJson=>this.onFormError(sendFormJson.message));
            }
        });

        return false;
    },
    onFormSuccess: function() {
        document.getElementById('apply-form').style.display = 'none';
        document.getElementById('form-success').style.display = 'flex';
    },
    onFormError: function(message) {
        document.getElementById('apply-form-error').innerText = message;
    },
    checkForFile: function() {
        const fileInput	=document.getElementById('upload-input');

        if ( fileInput.files && fileInput.files[0] )
            return true;
        fileInput.focus();

        return false;
    },

    formValidation: function() {
        const errorMessages = {
            empty: 'Please fill out this field',
            wrongEmail: 'Please enter a valid email',
            noFile: 'Please add a file',
        };
        const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const name = document.getElementsByName('full_name')[0];
        const email = document.getElementsByName('email')[0];
        const phone = document.getElementsByName('phone')[0];
        const source = document.getElementsByName('comment-about')[0];
        const cv = document.getElementsByName('cv')[0];

        if(!name.value) {
            this.setError(name, errorMessages.empty);
            return false;
        }

        if(!email.value) {
            this.setError(email, errorMessages.empty);
            return false;
        }

        if(!emailRegEx.test(email.value.toLowerCase())) {
            this.setError(email, errorMessages.wrongEmail);
            return false;
        }

        if(!phone.value) {
            this.setError(phone, errorMessages.empty);
            return false;
        }

        if(!source.value) {
            this.setError(source, errorMessages.empty);
            return false;
        }

        if(!cv.files || !cv.files[0] ) {
            this.setError(cv, errorMessages.noFile);
            return false;
        }

        return true;
    },

    setError: function(element, message) {
        const errorEl = element.nextElementSibling;
        errorEl.textContent = message;
        errorEl.style.display = 'inline-block';
        element.scrollIntoView();
    },

    initFileUpload: function() {
        const fileUploadEl		= document.getElementById('file-upload'),
            errorEl	= document.getElementById('upload-error'),
            fileTargetEl = document.getElementById('file-target'),
            fileNameEl = document.getElementById('file-name'),
            removeFileEl = document.getElementById('remove-file'),
            fileInput	=document.getElementById('upload-input');

        fileInput.addEventListener('change', () => {
            if ( !(fileInput && fileInput.files && fileInput.files[0]) )
                return false;

            let filename = fileInput.files[0].name,
                allowed = false;
            for ( let i = 0; i < this.filesAllowed.length; i++ ) {
                if ( filename.indexOf(this.filesAllowed[i]) > -1 )
                    allowed = true;
            }

            fileTargetEl.classList.remove('active');

            if ( allowed ) {
                fileNameEl.innerText = filename;
                fileUploadEl.classList.remove('empty');
            } else {
                this.setError(fileInput, 'Unsupported format');
                fileUploadEl.classList.add('empty');
                fileInput.val = '';
                fileInput.type = 'text';
                fileInput.type = 'file';
            }

            return false;
        });

        removeFileEl.addEventListener('click', () => {
            errorEl.classList.remove('show');
            fileNameEl.innerText = '';
            fileTargetEl.classList.remove('active');
            fileUploadEl.classList.add('empty');
            fileInput.val('');
        });

        fileTargetEl.addEventListener('dragenter', () => {fileTargetEl.classList.add('active');});
        fileTargetEl.addEventListener('dragover', () => {fileTargetEl.classList.add('active');});

        fileTargetEl.addEventListener('blur', () => {fileTargetEl.classList.remove('active');});
        fileTargetEl.addEventListener('dragleave', () => {fileTargetEl.classList.remove('active');});

        fileInput.addEventListener('focus', () => {fileTargetEl.classList.add('active');});

        fileInput.addEventListener('blur', () => {fileTargetEl.classList.remove('active');});
    }
};

OW.careers.initForm();


//input validation msg
