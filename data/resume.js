'use strict';

function escHTML(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function MD(str) {
	str = str.replace(/&quot;/g, '"');
	str = escHTML(str);
	str = str.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
	str = str.replace(/[*](.+?)[*]/g, '<em>$1</em>');
	str = str.replace(/\n/g, '<br>');
	return str;
}

function render(cv) {
	document.title = cv.basics.name + "'s Curriculum Vitae / Résumé";

	$('head').append('<link rel="shortcut icon" href="'+escHTML(cv.basics.image)+'">');

	let html = '<div class="card profile p-2">';
	html += '<div class="profile-head"><div class="profile-pic text-center"><img src="'+escHTML(cv.basics.image)+'"></div><div class="text-center"><h3>'+MD(cv.basics.name)+'</h3><span class="text-muted">'+MD(cv.basics.label)+'</span></div></div>';

	html += '<hr>';
	html += '<div class="container-fluid d-print-flex">';

	let loc = escHTML(cv.basics.location.address+', '+cv.basics.location.city+', '+cv.basics.location.countryCode);
	let langs = [];
	for (let i=0 ; i<cv.languages.length ; ++i) {
		langs.push('<span class="text-nowrap">'+MD(cv.languages[i].language) + ' <code title="CEFR Level">'+cv.languages[i].cefr+'</code></span>');
	}

	let ds = [
		['geo-alt', '<div class="text-start"><a class="text-reset text-nowrap" href="https://maps.google.com/maps?q='+loc+'">'+MD(cv.basics.location.address)+'<br>'+MD(cv.basics.location.postalCode)+' '+MD(cv.basics.location.city)+'<br>'+MD(cv.basics.location.countryCode)+'</a></div>'],
		['telephone', '<a class="text-reset text-nowrap" href="tel:'+escHTML(cv.basics.phone)+'">'+escHTML(cv.basics.phone)+'</a>'],
		['envelope', '<a class="text-reset text-nowrap" href="mailto:'+escHTML(cv.basics.email)+'">'+escHTML(cv.basics.email)+'</a>'],
		['translate', langs.join(', ')],
		];
	for (let i=0 ; i<ds.length ; ++i) {
		html += '<div class="profile-entry flex-column flex-1 m-2"><span class="d-table-cell text-center px-2"><i class="bi bi-'+ds[i][0]+'"></i></span><span class="d-table-cell print-center px-2 fs-7">'+ds[i][1]+'</span></div>';
	}

	html += '</div>';

	html += '<hr>';
	html += '<div class="text-center mb-2">';
	let ps = [];
	for (let i=0 ; i<cv.basics.profiles.length ; ++i) {
		ps.push('<a class="text-reset mx-1 px-1 fs-3" href="'+escHTML(cv.basics.profiles[i].url)+'" title="'+escHTML(cv.basics.profiles[i].username)+' on '+escHTML(cv.basics.profiles[i].network)+'"><i class="bi bi-'+cv.basics.profiles[i].network.toLowerCase()+'"></i></a>');
	}
	html += ps.join('');
	html += '</div>';

	html += '</div>';
	$('#who').html(html);

	$('#intro-text').html(MD(cv.basics.summary));

	html = '';
	for (let i=0 ; i<cv.work.length ; ++i) {
		html += '<hr>';
		html += '<div class="experience print-item">';
		html += '<div><strong>'+MD(cv.work[i].position)+'</strong>, <a href="'+escHTML(cv.work[i].url)+'" target="_blank">'+MD(cv.work[i].name)+'</a></div>';
		html += '<div class="m-2">'+MD(cv.work[i].summary)+'</div>';
		if (typeof cv.work[i].highlights !== 'undefined') {
			html += '<ul class="mt-2">';
			for (let j=0 ; j<cv.work[i].highlights.length ; ++j) {
				html += '<li>'+MD(cv.work[i].highlights[j])+'</li>';
			}
			html += '</ul>';
		}
		html += '</div>';
	}
	$('#experience-text').html(html);

	html = '';
	for (let i=0 ; i<cv.projects.length ; ++i) {
		html += '<hr>';
		html += '<div class="project print-item">';
		html += '<div><strong><a href="'+escHTML(cv.projects[i].url)+'" target="_blank">'+MD(cv.projects[i].name)+'</a></strong></div>';
		html += '<div class="m-2">'+MD(cv.projects[i].description)+'</div>';
		html += '</div>';
	}
	$('#projects-text').html(html);

	html = '';
	for (let i=0 ; i<cv.skills[0].keywords.length ; ++i) {
		html += '<span class="badge text-bg-primary">'+escHTML(cv.skills[0].keywords[i])+'</span> ';
	}
	$('#skills-text').html(html);

	html = '';
	for (let i=0 ; i<cv.volunteer.length ; ++i) {
		html += '<hr>';
		html += '<div class="experience print-item">';
		html += '<div><strong>'+MD(cv.volunteer[i].position)+'</strong>, '+MD(cv.volunteer[i].organization)+'</div>';
		//html += '<div class="m-2">'+MD(cv.volunteer[i].summary)+'</div>';
		if (typeof cv.volunteer[i].highlights !== 'undefined') {
			html += '<ul class="mt-2">';
			for (let j=0 ; j<cv.volunteer[i].highlights.length ; ++j) {
				html += '<li>'+MD(cv.volunteer[i].highlights[j])+'</li>';
			}
			html += '</ul>';
		}
		html += '</div>';
	}
	$('#volunteer-text').html(html);

	html = '';
	for (let i=0 ; i<cv.publications.length ; ++i) {
		html += '<hr>';
		html += '<div class="experience print-item">';
		html += '<div><strong>'+MD(cv.publications[i].name)+'</strong>, <a href="'+escHTML(cv.publications[i].url)+'" target="_blank">'+MD(cv.publications[i].publisher)+'</a></div>';
		html += '<div class="ms-2 text-secondary fs-7">'+MD(cv.publications[i].releaseDate)+'</div>';
		html += '<div class="m-2">'+MD(cv.publications[i].summary)+'</div>';
		html += '</div>';
	}
	$('#publications-text').html(html);
}

$(window).on('load', function() {
	$.getJSON('data/resume.json', render);
});
