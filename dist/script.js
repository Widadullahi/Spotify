// Real recordings by Kevin MacLeod, available under CC BY 4.0.
// Source: https://incompetech.com/agent-section/
const musicBase = 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/';
const sourceBase = 'https://incompetech.com/music/royalty-free/index.html?isrc=';
const musicTracks = [
  {id:'tafi-maradi',title:'Tafi Maradi',genre:'African',duration:159,art:'art-orange',symbol:'✺',description:'Percussion and shakers with a lively groove.',file:'Tafi Maradi.mp3',isrc:'USUAN1100739'},
  {id:'electro-cabello',title:'Electro Cabello',genre:'Disco',duration:191,art:'art-purple',symbol:'✳',description:'A bright blend of disco, salsa and ukulele.',file:'Electro Cabello.mp3',isrc:'USUAN1400048'},
  {id:'electrodoodle',title:'Electrodoodle',genre:'Electronica',duration:166,art:'art-blue',symbol:'✦',description:'Playful electronic rhythms and a happy melody.',file:'Electrodoodle.mp3',isrc:'USUAN1200079'},
  {id:'loopster',title:'Loopster',genre:'Funk',duration:182,art:'art-pink',symbol:'◈',description:'Layered phrases building into a grooving funk track.',file:'Loopster.mp3',isrc:'USUAN1800007'},
  {id:'poppers-prosecco',title:'Poppers and Prosecco',genre:'Jazz',duration:194,art:'art-gold',symbol:'☀',description:'A light jazz performance for easy listening.',file:'Poppers and Prosecco.mp3',isrc:'USUAN1700014'},
  {id:'wepa',title:'Wepa',genre:'Latin',duration:195,art:'art-green',symbol:'❋',description:'An upbeat Latin groove with an energetic rhythm.',file:'Wepa.mp3',isrc:'USUAN1700020'},
  {id:'glitter-blast',title:'Glitter Blast',genre:'Pop',duration:178,art:'art-pink',symbol:'✧',description:'Ukulele, flutes and bright percussion.',file:'Glitter Blast.mp3',isrc:'USUAN1900001'},
  {id:'maccary-bay',title:'Maccary Bay',genre:'Reggae',duration:240,art:'art-green',symbol:'☾',description:'A layered reggae track with wah guitar.',file:'Maccary Bay.mp3',isrc:'USUAN1500019'},
  {id:'feelin-good',title:'Feelin Good',genre:'Rock',duration:225,art:'art-blue',symbol:'♫',description:'A cheerful guitar-driven rock track.',file:'Feelin Good.mp3',isrc:'USUAN1100475'}
].map(track=>({...track,artist:'Kevin MacLeod',audioUrl:musicBase+encodeURIComponent(track.file),sourceUrl:sourceBase+track.isrc}));
const $ = (selector) => document.querySelector(selector);
const audio = $('#audio');
const state = {tracks:[...musicTracks],index:-1,view:'home',playlist:null,history:[{view:'home',playlist:null}],historyIndex:0,query:'',shuffle:false,repeat:false,liked:new Set(JSON.parse(localStorage.getItem('soundspace-likes') || '[]').filter(id=>musicTracks.some(track=>track.id===id)))};
const playlists={chill:{title:'Late Night Vibes',genres:['Jazz','Reggae','Pop']},energy:{title:'Feel Good Mix',genres:['African','Disco','Latin','Rock']},focus:{title:'Deep Focus',genres:['Electronica','Funk','Jazz']}};
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const timeLabel = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '0:00';
const currentTrack = () => state.tracks[state.index];

function renderFeatured(){
  $('#featured-grid').innerHTML=musicTracks.slice(0,4).map(track=>`<button class="featured-card" data-play="${track.id}" aria-label="Play ${escapeHtml(track.title)}"><div class="card-art ${track.art}"><span class="card-shape">${track.symbol}</span><span class="card-play"><svg><use href="#i-play"/></svg></span></div><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.genre)} · Kevin MacLeod</small></button>`).join('');
}
function visibleTracks(){
  let tracks=state.view==='liked'?state.tracks.filter(track=>state.liked.has(track.id)):state.view==='library'?state.tracks.filter(track=>track.local):state.view==='playlist'?state.tracks.filter(track=>playlists[state.playlist].genres.includes(track.genre)):state.tracks;
  if(state.query)tracks=tracks.filter(track=>`${track.title} ${track.artist} ${track.genre}`.toLowerCase().includes(state.query.toLowerCase()));
  return tracks;
}
function renderTracks(){
  const tracks=visibleTracks();
  $('#track-list').innerHTML=tracks.length?tracks.map((track,position)=>`<div class="track-row ${currentTrack()?.id===track.id?'is-playing':''}" data-row="${track.id}"><span class="track-number">${String(position+1).padStart(2,'0')}</span><div class="track-title-cell"><div class="row-art ${track.art}">${track.symbol}</div><div class="row-meta"><strong>${escapeHtml(track.title)}</strong><span>${escapeHtml(track.artist)}</span></div></div><span class="genre">${escapeHtml(track.genre)}</span><span class="track-time">${timeLabel(track.duration)}</span><button class="row-like ${state.liked.has(track.id)?'liked':''}" data-like="${track.id}" aria-label="${state.liked.has(track.id)?'Unlike':'Like'} ${escapeHtml(track.title)}"><svg><use href="#i-heart"/></svg></button></div>`).join(''):`<div class="empty-state">${state.view==='liked'?'No liked songs yet. Tap a heart to save one.':state.view==='library'?'Your library is empty. Add audio files to get started.':'No tracks found. Try another search.'}</div>`;
  $('#liked-count').textContent=state.liked.size;
  $('#liked-word').textContent=state.liked.size===1?'song':'songs';
}
function setView(view,playlist=null,record=true){
  state.view=view;state.playlist=playlist;state.query='';
  if(record){state.history=state.history.slice(0,state.historyIndex+1);state.history.push({view,playlist});state.historyIndex=state.history.length-1;}
  document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  document.querySelectorAll('[data-playlist]').forEach(button=>button.classList.toggle('selected',view==='playlist'&&button.dataset.playlist===playlist));
  $('#hero').hidden=view!=='home';$('#featured-section').hidden=view!=='home';$('#artists-section').hidden=view!=='home';
  const headings={home:['YOUR DAILY MIX','Songs to play'],search:['SEARCH','Find your next song'],library:['LOCAL FILES','Your music'],liked:['PLAYLIST','Liked Songs'],playlist:['PLAYLIST',playlists[playlist]?.title||'Playlist']};
  $('#track-kicker').textContent=headings[view][0];
  $('#track-heading').innerHTML=`${headings[view][1]}<span class="accent-period">.</span>`;
  $('#show-all').hidden=view!=='home';
  let box=$('.search-box');if(box)box.remove();
  if(view==='search'){
    box=document.createElement('label');box.className='search-box';
    box.innerHTML='<svg><use href="#i-search"/></svg><input id="search-input" type="search" placeholder="Search songs, artists, or genres" aria-label="Search songs">';
    $('#tracks-section .section-heading').after(box);
    $('#search-input').addEventListener('input',event=>{state.query=event.target.value;renderTracks();});
    $('#search-input').focus();
  }
  renderTracks();
  if(view!=='home')$('#tracks-section').scrollIntoView({behavior:'smooth',block:'start'});
}
function updateNowPlaying(){
  const track=currentTrack();if(!track)return;
  $('#now-title').textContent=$('#player-title').textContent=track.title;
  $('#now-artist').textContent=$('#player-artist').textContent=track.artist;
  $('#now-description').textContent=track.description;
  const credit=$('#track-credit');
  credit.hidden=!!track.local;
  if(!track.local){credit.href=track.sourceUrl;credit.textContent=`“${track.title}” by Kevin MacLeod · CC BY 4.0 ↗`;}
  $('#now-art').className=`now-art ${track.art}`;$('#now-art .art-shape').textContent=track.symbol;
  $('#now-art .art-code').textContent=`MUSIC / ${String(state.index+1).padStart(2,'0')}`;
  $('#player-art').className=`player-art ${track.art}`;$('#player-art').textContent=track.symbol;
  for(const button of [$('#now-like'),$('#player-like')]){
    button.classList.toggle('liked',state.liked.has(track.id));
    button.setAttribute('aria-label',`${state.liked.has(track.id)?'Unlike':'Like'} ${track.title}`);
  }
  $('#duration').textContent=timeLabel(track.duration);
  const next=state.tracks[(state.index+1)%state.tracks.length];
  $('#next-track-label').textContent=next?`${next.title} · ${next.artist}`:'Press play to get started';
  renderQueue();
  renderTracks();
}
function renderQueue(){
  const list=$('#queue-list');if(!list)return;
  const upcoming=state.index<0?state.tracks:state.tracks.slice(state.index+1).concat(state.tracks.slice(0,state.index));
  list.innerHTML=upcoming.slice(0,8).map(track=>`<button class="queue-item" data-queue="${track.id}"><span class="row-art ${track.art}">${track.symbol}</span><span><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.artist)}</small></span></button>`).join('');
}
function updatePlayButton(){
  const playing=!audio.paused;
  $('#play-pause').innerHTML=`<svg><use href="#i-${playing?'pause':'play'}"/></svg>`;
  $('#play-pause').setAttribute('aria-label',playing?'Pause':'Play');
}
function playIndex(index){
  if(index<0||index>=state.tracks.length)return;
  state.index=index;
  const track=currentTrack();
  audio.src=track.local?track.url:track.audioUrl;
  audio.play().catch(()=>{$('#now-description').textContent='Could not start this track. Check your connection and try another song.';updatePlayButton();});
  updateNowPlaying();updatePlayButton();
}
function nextTrack(direction=1){
  if(!state.tracks.length)return;
  if(state.shuffle&&direction>0&&state.tracks.length>1){
    let next;do{next=Math.floor(Math.random()*state.tracks.length)}while(next===state.index);
    playIndex(next);return;
  }
  playIndex((state.index+direction+state.tracks.length)%state.tracks.length);
}
function togglePlay(){
  if(state.index<0){playIndex(Math.floor(Math.random()*state.tracks.length));return;}
  if(audio.paused)audio.play().catch(()=>{});else audio.pause();
}
function toggleLike(id){
  if(state.liked.has(id))state.liked.delete(id);else state.liked.add(id);
  localStorage.setItem('soundspace-likes',JSON.stringify([...state.liked]));
  renderTracks();updateNowPlaying();
}
function openUpload(){$('#file-input').click();}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
$('.brand').addEventListener('click',event=>{event.preventDefault();setView('home')});
document.querySelectorAll('[data-playlist]').forEach(button=>button.addEventListener('click',()=>setView('playlist',button.dataset.playlist)));
$('#quick-grid').addEventListener('click',event=>{if(event.target.closest('#random-play')){playIndex(Math.floor(Math.random()*state.tracks.length));return;}const play=event.target.closest('[data-play]');if(play)playIndex(state.tracks.findIndex(track=>track.id===play.dataset.play));});
$('#go-back').addEventListener('click',()=>{if(state.historyIndex>0){const previous=state.history[--state.historyIndex];setView(previous.view,previous.playlist,false)}});
$('#go-forward').addEventListener('click',()=>{if(state.historyIndex<state.history.length-1){const next=state.history[++state.historyIndex];setView(next.view,next.playlist,false)}});
$('#upload-side').addEventListener('click',openUpload);$('#upload-main').addEventListener('click',openUpload);
$('#mobile-upload').addEventListener('click',openUpload);
$('#file-input').addEventListener('change',event=>{
  const files=[...event.target.files].filter(file=>file.type.startsWith('audio/'));
  files.forEach(file=>state.tracks.push({id:`local-${crypto.randomUUID()}`,title:file.name.replace(/\.[^.]+$/,''),artist:'Your music',genre:'Local file',duration:0,art:'art-green',symbol:'♫',description:'A track you added from your device. It stays available until you close or reload this page.',local:true,url:URL.createObjectURL(file)}));
  event.target.value='';if(files.length)setView('library');
});
$('#featured-grid').addEventListener('click',event=>{const card=event.target.closest('[data-play]');if(card)playIndex(state.tracks.findIndex(track=>track.id===card.dataset.play));});
$('#track-list').addEventListener('click',event=>{
  const like=event.target.closest('[data-like]');if(like){toggleLike(like.dataset.like);return;}
  const row=event.target.closest('[data-row]');if(row)playIndex(state.tracks.findIndex(track=>track.id===row.dataset.row));
});
$('#now-like').addEventListener('click',()=>{if(currentTrack())toggleLike(currentTrack().id)});
$('#player-like').addEventListener('click',()=>{if(currentTrack())toggleLike(currentTrack().id)});
$('#show-all').addEventListener('click',()=>setView('search'));
$('#queue-toggle').addEventListener('click',()=>{$('#queue-drawer').hidden=!$('#queue-drawer').hidden;renderQueue()});
$('#show-queue').addEventListener('click',()=>{$('#queue-drawer').hidden=false;renderQueue()});
$('#close-queue').addEventListener('click',()=>{$('#queue-drawer').hidden=true});
$('#queue-list').addEventListener('click',event=>{const row=event.target.closest('[data-queue]');if(row){playIndex(state.tracks.findIndex(track=>track.id===row.dataset.queue));$('#queue-drawer').hidden=true}});
$('#close-now').addEventListener('click',()=>{const shell=$('.app-shell');shell.classList.remove('show-now');shell.classList.add('now-hidden');$('.now-panel').hidden=true});
$('#now-toggle').addEventListener('click',()=>{const shell=$('.app-shell');shell.classList.remove('now-hidden');shell.classList.add('show-now');$('.now-panel').hidden=false});
$('#play-pause').addEventListener('click',togglePlay);
$('#previous').addEventListener('click',()=>{if(audio.currentTime>3)audio.currentTime=0;else nextTrack(-1)});
$('#next').addEventListener('click',()=>nextTrack());
$('#shuffle').addEventListener('click',()=>{state.shuffle=!state.shuffle;$('#shuffle').classList.toggle('active',state.shuffle);$('#shuffle').setAttribute('aria-pressed',state.shuffle)});
$('#repeat').addEventListener('click',()=>{state.repeat=!state.repeat;$('#repeat').classList.toggle('active',state.repeat);$('#repeat').setAttribute('aria-pressed',state.repeat)});
$('#seek').addEventListener('input',event=>{if(audio.duration)audio.currentTime=audio.duration*event.target.value/100});
$('#volume').addEventListener('input',event=>audio.volume=event.target.value/100);
audio.addEventListener('play',updatePlayButton);audio.addEventListener('pause',updatePlayButton);
audio.addEventListener('loadedmetadata',()=>{if(currentTrack()&&Number.isFinite(audio.duration)){currentTrack().duration=audio.duration;$('#duration').textContent=timeLabel(audio.duration);renderTracks()}});
audio.addEventListener('error',()=>{if(currentTrack())$('#now-description').textContent='This track could not load. Check your connection and try another song.'});
audio.addEventListener('timeupdate',()=>{$('#current-time').textContent=timeLabel(audio.currentTime);$('#seek').value=audio.duration?audio.currentTime/audio.duration*100:0});
audio.addEventListener('ended',()=>{if(state.repeat){audio.currentTime=0;audio.play()}else nextTrack()});
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)){event.preventDefault();togglePlay()}});
audio.volume=.7;
const hour=new Date().getHours();$('#greeting').textContent=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
renderFeatured();renderTracks();renderQueue();
