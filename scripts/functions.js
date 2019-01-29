const emptyMain = () => {
	document.querySelector('main').innerText = '';
}

/**
 * fetch helper functions
 */
const fstatus = (response) => {
	return (response.status == 200) ? Promise.resolve(response) : Promise.reject(new Error(response.statusText));
}

const json = (response) => {
	return response.json(); 
}

const ferror = (error) => {
	console.log('Request failed: ', error);
}

/**
 * generic wrapper to fetch html/text file
 * @param {string} url
 * @param {function} handle
 */
const fetchHTML = (url) => {
	fetch(url).then(fstatus).then(function(response) {
		return response.text();
	}).then(function(data) {
		document.querySelector('main').innerHTML = data;
	}).catch(ferror);
}

/**
 * generic wrapper to fetch json data using http post requests
 * @param {string} body
 * @param {function} handle
 */
const fetchPostRequest = (body, handle, url='main.php') => {
	let post = {
		method: 'post',
		headers: {
			"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		body: body
	}
	fetch(url, post).then(fstatus).then(json).then(handle).catch(ferror);
}

const fetchQuestions = () => {
	let body = 'request=getQuestions';
	fetchPostRequest(body, createQuestionsForm);
}

const fetchAssesment = () => {
	let body = 'request=getAssesment';
	fetchPostRequest(body, createAssesmentForm);
}

const fetchAllAssesments = () => {
	let body = 'request=getAllAssesments';
	fetchPostRequest(body, createAssesmentForm2);	
}

const fetchAssesmentResultForUser = () => {
	let body = 'request=getAssesmentResultForUser';
	fetchPostRequest(body, displayResult);
}

const storeAssesmentResult = (id, res) => {
	let body = 'request=storeAssesmentResult&id='+id+'&result='+JSON.stringify(res)+'';
	fetchPostRequest(body, redirect);
}

const storeExamResult = (id, res) => {
	let body = 'request=storeExamResult&id='+id+'&result='+JSON.stringify(res)+'';
	fetchPostRequest(body, redirect);
}

const fetchUserInfo = () => {
	let body = 'request=getUserInfo';
	fetchPostRequest(body, populateUserInfo);
}

const fetchSignOut = () => {
	let body = 'request=logout';
	fetchPostRequest(body, redirect);
}

function fetchExam(){
	let body = 'request=getExam';
	fetchPostRequest(body, displayExam);
}

function fetchAllExams (){
	let body = 'request=getAllExams';
	fetchPostRequest(body, populateExamsSection);	
}

const redirect = (obj) => {
	location.href = obj.result ? obj.page : 'error.php';
}

function makeElement(type, attributes=[], innerText='') {
	let el = document.createElement(type);
	for(let attribute of attributes) {
		el.setAttribute(attribute[0], attribute[1]);
	}
	el.innerText = innerText;
	return el;
}

$("#bio").ready(function() {
  $("#hide").click(function() {
    $("#bio").hide();
  });
  $("#show").click(function() {
    $("#bio").show();
  });
});

function populateProfile() {
	fetchAssesmentResultForUser();
	fetchUserInfo();
	populateUserBadges();
	fetchAllExams();
}

function populateExamsSection(obj){
	console.log(obj);
	
	/*let section = document.querySelector('#main-content-right');
	let btns = [['fetchHtmlExams()', 'html'],['fetchCssExams()', 'css']];
	for(let i = 0; i < btns.length; i++){
		let btn = makeElement('button',[['onclick', btns[i][0]]], btns[i][1]);
		section.appendChild(btn);		
	}-*/
}

function populateUserBadges(obj) {
	let section = document.querySelector('#main-top-right');
	let figs = [];
	let img_urls = [['https://i.imgur.com/on2dxR0.png', 'HTML'], ['https://i.imgur.com/EOpWsok.png', 'CSS'], ['https://i.imgur.com/hRhGkUH.png', 'SQL'], ['https://i.imgur.com/OH1mR5y.png', 'PHP'], ['https://i.imgur.com/eHDzKet.png', 'Javascript']];
	let imgs = [];
	for(let i = 0; i < 5; i++) {
		figs.push(makeElement('figure'));
	}
	for(img_url of img_urls) {
		imgs.push(makeElement('img', [['src', img_url[0]], ['alt', `${img_url[1]} Badge`], ['title', `${img_url[1]} Badge`]]));
	}
	for(let i = 0; i < 5; i++) {
		section.append(figs[i]);
		figs[i].append(imgs[i]);
	}
	for(let i = 0; i < 5; i++) {
		let figcaption = makeElement('figcaption');
		for(let j = 0; j < 3; j++) {
			figcaption.appendChild(makeElement('i', [['class', 'far fa-star']]));
		}
		section.appendChild(figcaption);
	}
}

function populateUserInfo(obj) {
	let section = document.querySelector('#main-top-left');
	let h2 = makeElement('h2', [], `${obj.firstname} ${obj.lastname}`);
	let hr = makeElement('hr', [['width', '50%'], ['color', '#202020']]);
	let github = makeElement('a', [['href', obj.github], ['target', '_blank']]);
	let linkedin = makeElement('a', [['href', obj.linkedin], ['target', '_blank']]);
	section.appendChild(h2);
	section.appendChild(hr);
	section.appendChild(github); github.appendChild(makeElement('span', [['class', 'fab fa-github']]));
	section.appendChild(linkedin); linkedin.appendChild(makeElement('span', [['class', 'fab fa-linkedin-in']]));	
	section = document.querySelector('#main-content-left');
	let bio = makeElement('p', [], `bio: ${obj.bio}`);
	section.appendChild(bio);
}

function createQuestionsForm(obj) {
	let elem = document.getElementById('getQuestions');
	let frm = makeElement('form', [['method', 'post'], ['action', 'main.php'], ['id', 'create-exam']]);
	let ipt = makeElement('input', [['type', 'text'], ['name', 'description'], ['placeholder', 'Description of Exam']]);
	let br = makeElement('br');
	elem.appendChild(frm);
	frm.appendChild(ipt); frm.appendChild(br);
	for(let q of obj) {
		let checkbx = makeElement('input', [['type', 'checkbox'], ['id', `question${q.id}`], ['name', `question${q.id}`], ['value', q.id]]);
		let lbl = makeElement('label', [['for', `question${q.id}`]], `${q.question}?`);
		let br = makeElement('br');
		frm.appendChild(checkbx); frm.appendChild(lbl); frm.appendChild(br);
	}
	let selectLevel = makeElement('select', [['form', 'create-exam'], ['name', 'level']]);
	for(let lvl of ['easy', 'moderate', 'hard']) {
		opti = makeElement('option', [['value', lvl]], lvl);
		selectLevel.appendChild(opti);
	}
	let selectCategory = makeElement('select', [['form', 'create-exam'], ['name', 'category']])
	for(let cat of ['html', 'css', 'javascript', 'php', 'sql']) {
		opti = makeElement('option', [['value', cat]], cat);
		selectCategory.appendChild(opti);
	}
	let hide = makeElement('input', [['type', 'hidden'], ['name', 'request'], ['value', 'createExam']]);
	let subm = makeElement('input', [['type', 'submit']]);
	frm.appendChild(selectCategory); frm.appendChild(selectLevel); 
	frm.appendChild(hide); frm.appendChild(subm);
}

function createAssesmentForm(obj) {
	emptyMain();
	if(!obj || typeof obj != 'object') { throw new Error('not an object'); }	
	let main = document.querySelector('main');
	let h1 = makeElement('h1', [], obj.title);
	let h2 = makeElement('h2', [], obj.description);
	let section = document.createElement('section');
	section.setAttribute('class', 'sliders');
	let datalist = makeElement('datalist', [['id', 'tickmarks'], ['style', 'display: visible']]);
	let hide = makeElement('input', [['type', 'hidden'], ['value', `${obj.id}`], ['id', 'hidden']]);
	let btn = makeElement('button', [['onclick', 'getResult()'], ['class', 'btn']], 'Submit');
	main.appendChild(h1);
	main.appendChild(h2);
	section.appendChild(datalist);
	section.appendChild(hide);
	for(let i = 0; i < 101; i+=10) {
		let opt = makeElement('option', [['value', `${i}`]]);
		datalist.appendChild(opt);
	}
	for(let category of JSON.parse(obj.assesment)) {
		let span = makeElement('span');
		let h3 = makeElement('h3', [], category);
		section.appendChild(h3);
		span.innerText = 'bad';
		section.appendChild(span);
		ipt = makeElement('input', [['type', 'range'], ['list', 'tickmarks'], ['min', '0'], ['max', '100'], ['step', '10'], ['name', `${category}`]]);
		span = makeElement('span');
		span.innerText = 'excellent';
		section.appendChild(ipt);
		section.appendChild(span);
		section.appendChild(makeElement('br'));
	}
	main.appendChild(section);
	section.appendChild(btn);
}

function createAssesmentForm2(obj){
	emptyMain();
	if(!obj || typeof obj != 'object') { throw new Error('not an object'); }	
	let main = document.querySelector('main');
	let h1 = makeElement('h1', [], obj[0].title);
	let h2 = makeElement('h2', [], obj[0].description);
	let section = document.createElement('section');
	section.setAttribute('class', 'sliders');
	let datalist = makeElement('datalist', [['id', 'tickmarks'], ['style', 'display: visible']]);
	let hide = makeElement('input', [['type', 'hidden'], ['value', `${obj[0].id}`], ['id', 'hidden']]);
	let btn = makeElement('button', [['onclick', 'getResult()'], ['class', 'btn']], 'Submit');
	main.appendChild(h1);
	main.appendChild(h2);
	section.appendChild(datalist);
	section.appendChild(hide);
	for(let i = 0; i < 101; i+=10) {
		let opt = makeElement('option', [['value', `${i}`]]);
		datalist.appendChild(opt);
	}
	for(let category of JSON.parse(obj[0].assesment)) {
		let span = makeElement('span');
		let h3 = makeElement('h3', [], category);
		section.appendChild(h3);
		span.innerText = 'bad';
		section.appendChild(span);
		ipt = makeElement('input', [['type', 'range'], ['list', 'tickmarks'], ['min', '0'], ['max', '100'], ['step', '10'], ['name', `${category}`]]);
		span = makeElement('span');
		span.innerText = 'excellent';
		section.appendChild(ipt);
		section.appendChild(span);
		section.appendChild(makeElement('br'));
	}
	main.appendChild(section);
	section.appendChild(btn);

}

function getResult() {
	let res = [];
	let id = false;
	let ipts = document.querySelectorAll('input');
	for(let ipt of ipts) {
		if(ipt.id != 'hidden') { res.push(ipt.value); }
		else { id = ipt.value; }
	}
	storeAssesmentResult(id, res);
}

function displayResult(obj) {
	let title =makeElement('h2', [], obj.title);
	let main = document.getElementById("main-content-center");
	main.appendChild(title);
	const dataset =  obj.results.map(x => parseInt(x));
	const w = 600;
    const h = 150;
	const barPadding = 5;
	const svg = d3.select("#main-content-center")
                .append("svg")
                .attr("width", w)
                .attr("height", h + 35)
				.attr("viewBox", "0 0 " + w + " " + h )
				.attr("preserveAspectRatio", "xMidYMid")
				.attr("id", "chart");			
	// create bars
    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", (d, i) => i * w / dataset.length)
       .attr("y", (d, i) => h - d)
       .attr("width", w / dataset.length - barPadding)
	   .attr("height", (d, i) => d)
       .attr("fill", (d => (d < 60) ? "red" : "green"))
       .attr("class", "bar")
		// create tooltip
       .append("title")
	   .attr("class", "tooltip")
       .text((d, i) => (obj.assesment,obj.assesment[i]));  
	// add text
	svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
	   .attr("font-family", "Roboto Condensed", "sans-serif")
	   .attr("font-size", "16px")
	   .attr("font-weight", "bold")
	   .attr("fill", "#000")
	   .attr("text-anchor", "middle")
       .text((d) => d)
       .attr("x", (d, i) => i * (w / dataset.length) + (w / dataset.length - barPadding) / 2)
       .attr("y", (d, i) => h - (d  + 4) );
	// resize
	let chart = $("#chart");
	let aspect = chart.width() / chart.height();
	let container = chart.parent();	
	$(window).on("resize", function(){
		let targetWidth = container.width();
		chart.attr("width", targetWidth);
		chart.attr("height", Math.round(targetWidth / aspect));
	}).trigger("resize");    
}

function createQuestionElementsArray(question) {
	let stager = [];
	let h2 = makeElement('h2', [], question.question);
	let fs = makeElement('fieldset', [['id', question.id], ['class', 'fieldset']]);
	fs.appendChild(h2);
	for(let i = 0; i < question.answers.length; i++) {
		let iradio = makeElement('input', [['type', 'radio'], ['value', `${question.id}_${i}`], ['name', `${question.id}`], ['id', `${question.id}_${i}`]]);
		let lbl = makeElement('label', [['class', 'label'], ['for', `${question.id}_${i}`]], question.answers[i]);
		let spn = makeElement('span', [['class', 'checkmark']]);
		lbl.appendChild(iradio); lbl.appendChild(spn); fs.appendChild(lbl);
	}
	return[fs];
}

function displayExam(obj) {
	if(!obj || typeof obj != 'object') { throw new Error('not an object'); }
	let exam = obj[0];
	let questions = obj[1];
	let main = document.querySelector('main');
	let section = makeElement('section', [['id', 'exam']])
	let btn = makeElement('button', [['onclick', 'getResultExam()'], ['class', 'btn']], 'Submit')
	let hide = makeElement('input', [['type', 'hidden'], ['value', `${exam.id}`], ['id', 'exams_id']]);
	main.appendChild(section);
	section.appendChild(hide);
	
	let question_ids = exam.question_ids;
	for(let i = 0; i < question_ids.length; i++) {
		for(let question of questions) {
			if(question.id == question_ids[i]) {
				for(let elem of createQuestionElementsArray(question)) { 
					section.appendChild(elem); 
				}
			}
		}
	}
	section.appendChild(btn);
}

function getResultExam() {
	let id = document.getElementById('exams_id').value;
	let res = [];
	for(let fs of document.querySelectorAll('fieldset')) {
		let elem = document.getElementById(fs.id + '_0');
		res.push(elem.checked);
	}
	storeExamResult(id, res);
}