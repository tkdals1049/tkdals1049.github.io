var canvas = document.getElementById('nokey'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');

// console.log(typeof can_w);

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   },
   ball_color = {
       r: 207,
       g: 255,
       b: 4
   },
   R = 2,
   balls = [],
   alpha_f = 0.03,
   alpha_phase = 0,
    
// Line
   link_line_width = 0.8,
   dis_limit = 260,
   add_mouse_point = true,
   mouse_in = false,
   mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
   };

// Random speed
function getRandomSpeed(pos){
    var  min = -1,
       max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}
console.log(randomNumFrom(0, 10));
// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;
        
        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }
        
        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    
}

// Draw lines
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
           
           fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
           if(fraction < 1){
               alpha = (1 - fraction).toString();

               ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
               ctx.lineWidth = link_line_width;
               
               ctx.beginPath();
               ctx.moveTo(balls[i].x, balls[i].y);
               ctx.lineTo(balls[j].x, balls[j].y);
               ctx.stroke();
               ctx.closePath();
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < 20){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

function goMovie(){
    initCanvas();
    initBalls(30);
    window.requestAnimationFrame(render);
}
goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
    console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    // console.log(mouse_ball);
});

function loadSkills(skills){
	var i=0,j;
	var skillsInnerHTML='';
	while(i<skills.length){

		var row = '<div class="row">';
		for(i=0;i<skills.length;i++){
			var skill = '<div class="col m2"><svg viewBox="0 0 128 128"><path d="'+skills[i].icon+'"></path></svg>'+skills[i].name+'</div>';
			row+=skill;
		}
		row+='</div>';
		skillsInnerHTML+=row;
		
		i=j;
	}
	$('#skills').html(skillsInnerHTML);
}

function loadProjects(projects){
projects.sort(function(a,b){
	return a.sn-b.sn;
});
var i=0,j;
var projectsInnerHTML='';
for(i=0;i<projects.length;i++){					
	project = ' <div class="row project"><div class="col m6 s12"><div class="row"><span class="title">'+projects[i].projectTitle+'</span><hr></div><div class="row"><span>'+projects[i].periodStart+'-'+projects[i].periodEnd+'</span></div>';
	toolsUsed = '<div class="row">Tools Used:&nbsp';
	for(j=0;j<projects[i].toolsUsed.length;j++){
		toolsUsed+='<span>'+projects[i].toolsUsed[j]+'</span>&nbsp';
	}
	toolsUsed+='</div>';
	project+=toolsUsed;
	tags = '<div class=row">'
	for(j=0;j<projects[i].tags.length;j++)tags+='<span class="tag">#'+projects[i].tags[j]+'</span>&nbsp';
	if(projects[i].link!="#") tags+='<a href="'+projects[i].link+'" target="_blank"><i class="material-icons right">language</i></a>';
	tags+='</div>';
	project+=tags;
	project+='</div><div class="col m6 s12 details">';
	if(projects[i].icon!="#") project+='<img src="img/'+projects[i].icon+'"></br>';
	project+=projects[i].shortInfo+'</div></div>';
	projectsInnerHTML+=project;
}
$('#projects').html(projectsInnerHTML);
}

function loadWorks(experince){
experince.sort(function(a,b){
	return a.sn-b.sn;
});
var i;
var works = experince;
var worksInnerHTML = '';
for(i=0;i<works.length;i++){
	worksInnerHTML+=`
	<div class="row work">
		<div class="row title">
			<a href="${works[i].link}">${works[i].organisation}</a> |
			${works[i].workPosition} |
			${works[i].periodStart} 
		</div>
		<hr/>
		<div class="row details">
			${works[i].experience}
		</div>
	</div>`;
}
$('#experience').html(worksInnerHTML);
}

function loadEducations(educations){
var i=0,j;
var educationsInnerHTML = '';
for(i=0;i<educations.length;i++){
	education = '<div class="row education"><div class="col m6 s12"><div class="row title">'+educations[i].course+'<hr></div><div class="row">'+educations[i].periodStart+'-'+educations[i].periodEnd+'</div><div class="row">'+educations[i].inst+'</div><div class="row">'+educations[i].board+'</div>		<div class="row">Scored: '+educations[i].score+'</div></div><div class="col m6 s12 details"><ul class="collapsible" data-collapsible="accordion"><li><div class="collapsible-header"><i class="material-icons">view_list</i>Completed following Core courses</div><div class="collapsible-body">';
	var courses = educations[i].courses;
	courses.sort(function(a,b){
		return a.sn-b.sn;
	});
	var coursesInnerHTML = '';
	for(j=0;j<courses.length;j++){
			coursesInnerHTML+='<div class="row"><div class="col m2 s2">'+courses[j].courseCode+'</div><div class="col m8 s8">'+courses[j].courseName+'</div><div class="col m2 s2">'+courses[j].courseScore+'</div></div>';
	}
	education+=coursesInnerHTML;
	education +='</div></li></ul></div></div>';
	educationsInnerHTML+=education;
}
$('#education').html(educationsInnerHTML);
}

function loadLinks(profileLinks){
var i=0,j;			
profileLinks.sort(function(a,b){
	return a.sn-b.sn;
});
var profileLinksInnerHTML = '';
while(i<profileLinks.length){
	profileLinksInnerHTML+='<div class="row">'
	for(j=i;j<profileLinks.length&&j<i+5;j++){
		profileLinksInnerHTML+='<div class="col s2"><a href="'+profileLinks[j].link+'" target="_blank" ><img src="img/'+profileLinks[j].icon+'" alt="'+profileLinks[j].name+'"></a></div>';
	}
	profileLinksInnerHTML+='</div>';
	i=j;
}
$('#links').html(profileLinksInnerHTML);
}

function loadLikes(likes){
	likes = likes.sort(function(a,b){
		return a.sn-b.sn;
	});
	var i;
	var likesInnerHTML = '<h4>I like</h4>';
	for(i=0;i<likes.length;i++){
		likesInnerHTML+='<object type="image/svg+xml" data="img/'+likes[i].icon+'">'+likes[i].name+'</object>'
	}
	$('#likes').html(likesInnerHTML);
}

function loadPics(pics)
{
	pics = pics.sort(function(a,b){
		return a.sn-b.sn;
	});
	var i;
	var row = '<h4>My Pics</h4>';
	
	for(i=0;i<pics.length;i++){
		row+='<img src="img/'+pics[i].icon+'" alt="이미지"/>';
	}
	//$('#pics').html('<h4>My Pic</h4><p><img src="img/pic1.jpg" alt="이미지" width="280px" /></p>');

	$('#pics').html(row);
}

function loadBlog() {
var blogHtml = `<div class='sk-ww-medium-publication-feed' data-embed-id='26322'></div><script src='https://www.sociablekit.com/app/embed/medium-publication-feed/widget.js'></script>`;
$('#blog').html(blogHtml);	
}

function onBodyLoad(){
console.log('body loaded called');
$('div.progress').css('display','none');
$('div.content').css('display','block');
$('.collapsible').collapsible({'accordion' : true});
$('#tabs').tabs({ 'swipeable': true });
onWindowResize();
}

function onWindowResize(){
	const heightPageA = parseInt($('#pagea').css('height').replace('px',''),10);
	const tabContentHeight = Math.max(heightPageA-40,(window.innerHeight - 150)) + 'px';
	
	const tabs = document.getElementsByClassName('tabs-content carousel initialized');
	if (tabs && tabs[0]) {
		tabs[0].style.height = tabContentHeight
	}
	$('#skills div.m2').css('height',$('#skills div.m2').css('width'));
	$('#image img').css('height',$('#image img').css('width'));
}

$(window).resize(onWindowResize);

var profile;

function loadSays() {
const SaysInnerHtml = `<div class="col m6">
	<h6>Recipe for this website:</h6>	
	<div class="row"> 
	이 블로그는 Github Page를 이용해서 만든 블로그 포트폴리오입니다.
	기존에 이용하던 블로그는 툴을 이용해 제작한 블로그이기에 삭제하고
	프로그래머로써 직접 제작하고자 만들어보았습니다.
	코드는 <a href="https://github.com/tkdals1049/tkdals1049.github.io/">여기</a>를 참조해주세요.
	</div>
</div>
<div class="col m6">
	<h6>Warm Gratitudes</h6>
	<div class="row">
		<div class="col m3 s3"><a href="https:https://pages.github.com/">Github Pages</a></div>
		<div class="col m3 s3"><a href="https://stackoverflow.com/">Stack Overflow</a></div>
		<div class="col m3 s3"><a href="https://jquery.com/">jQuery</a></div>
		<div class="col m3 s3"><a href="http://materializecss.com/">Materialize</a></div>
	</div>
	<div class="row">
		<div class="col m3 s3"><a href="https://fonts.google.com/">Google Fonts</a></div>	
		<div class="col m3 s3"><a href="http://konpa.github.io/devicon/">Devicons</a></div>
		<div class="col m3 s3"><a href="http://www.flaticon.com/">Flaticons</a></div>
		<div class="col m3 s3"><a href="https://simpleicons.org/">SimpleIcons</a></div>				
	</div>
	<div class="row">
		<div class="col m3 s3"><a href="http://noraesae.github.io/perfect-scrollbar/">Perfect Scrollbar</a></div>
		<div class="col m3 s3"><a href="http://www.mattboldt.com/demos/typed-js/">TypedJs</a></div>					
		<div class="col m3 s3"><a href="https://daneden.github.io/animate.css/">Animate.CSS</a></div>
		<div class="col m3 s3"><a href="http://t4t5.github.io/sweetalert/">Sweetalert</a></div>
	</div>
</div>`;
$('#Says').html(SaysInnerHtml);
}

$.get("js/profile.json", 
function(data, status){
	console.log('Got profile:',data,' \nwith status:',status);
	if(status!=="success")
	{
		swal({
		title: "Hello World!!!",
		text: "에러터짐."
	});
	}
	profile = data;
	var pInfo = profile.personalInfo;
	$('title').html(pInfo.nick+' | Portfolio');
	$('#blogname').html(pInfo.mname);
	$('#image img').attr('src','img/'+pInfo.myimg);
	$('#contact').html('</br>Name: '+pInfo.fname+pInfo.lname+'</br>Hobby: 게임 플레이 및 분석 </br>'+'Phone: '+pInfo.mob+'</br>'+'E-Mail: '+pInfo.email);
	$('#summary').html('<span></span>');
	var tes= ["</br>Introduction:<br/>"+profile.summary2];
	  const typed2 = new Typed('#summary span', {
		strings: tes,
		typeSpeed: 20,
		cursorChar:"_",
		loop:false
	});
	$('#tabs').html(`					
		<li class="tab col s2"><a href="#hello">Hello</a></li>
		<li class="tab col s2"><a href="#skills">Skills</a></li>
		<li class="tab col s2"><a href="#projects">Projects</a></li>
		<li class="tab col s3"><a href="#experience">Experience</a></li>
		<li class="tab col s3"><a href="#board">Borad</a></li>
	`);
	
	$('#helloText').html(profile.helloText);
	loadLinks(profile.profileLinks);
	loadSkills(profile.skills);
	loadWorks(profile.experince);
	loadSays();
	onBodyLoad();

	loadProjects(profile.projects);
	loadPics(profile.pics);
});