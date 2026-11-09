// Real recordings by Kevin MacLeod, available under CC BY 4.0. // Document the purpose or source of the code below.
// Source: https://incompetech.com/agent-section/ // Document the purpose or source of the code below.
const musicBase = 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/'; // Store the shared address used to build each audio URL.
const sourceBase = 'https://incompetech.com/music/royalty-free/index.html?isrc='; // Store the shared address used to build each music-credit URL.
const musicTracks = [ // Start the array of built-in track information.
  {id:'tafi-maradi',title:'Tafi Maradi',genre:'African',duration:159,art:'art-orange',symbol:'✺',description:'Percussion and shakers with a lively groove.',file:'Tafi Maradi.mp3',isrc:'USUAN1100739'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'electro-cabello',title:'Electro Cabello',genre:'Disco',duration:191,art:'art-purple',symbol:'✳',description:'A bright blend of disco, salsa and ukulele.',file:'Electro Cabello.mp3',isrc:'USUAN1400048'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'electrodoodle',title:'Electrodoodle',genre:'Electronica',duration:166,art:'art-blue',symbol:'✦',description:'Playful electronic rhythms and a happy melody.',file:'Electrodoodle.mp3',isrc:'USUAN1200079'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'loopster',title:'Loopster',genre:'Funk',duration:182,art:'art-pink',symbol:'◈',description:'Layered phrases building into a grooving funk track.',file:'Loopster.mp3',isrc:'USUAN1800007'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'poppers-prosecco',title:'Poppers and Prosecco',genre:'Jazz',duration:194,art:'art-gold',symbol:'☀',description:'A light jazz performance for easy listening.',file:'Poppers and Prosecco.mp3',isrc:'USUAN1700014'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'wepa',title:'Wepa',genre:'Latin',duration:195,art:'art-green',symbol:'❋',description:'An upbeat Latin groove with an energetic rhythm.',file:'Wepa.mp3',isrc:'USUAN1700020'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'glitter-blast',title:'Glitter Blast',genre:'Pop',duration:178,art:'art-pink',symbol:'✧',description:'Ukulele, flutes and bright percussion.',file:'Glitter Blast.mp3',isrc:'USUAN1900001'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'maccary-bay',title:'Maccary Bay',genre:'Reggae',duration:240,art:'art-green',symbol:'☾',description:'A layered reggae track with wah guitar.',file:'Maccary Bay.mp3',isrc:'USUAN1500019'}, // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
  {id:'feelin-good',title:'Feelin Good',genre:'Rock',duration:225,art:'art-blue',symbol:'♫',description:'A cheerful guitar-driven rock track.',file:'Feelin Good.mp3',isrc:'USUAN1100475'} // Define one track with its ID, title, genre, duration, artwork, description, file, and credit code.
].map(track=>({...track,artist:'Kevin MacLeod',audioUrl:musicBase+encodeURIComponent(track.file),sourceUrl:sourceBase+track.isrc})); // Add the artist name and complete audio and credit URLs to every track.
const $ = (selector) => document.querySelector(selector); // Create a short helper for finding the first element matching a CSS selector.
const audio = $('#audio'); // Store the one HTML audio element controlled by this app.
const savedLikes = (() => { // Safely start reading liked tracks from browser storage.
  try { // Start a protected operation that may fail.
    const value = JSON.parse(localStorage.getItem('soundspace-likes') || '[]'); // Read or save liked songs in the browser.
    return Array.isArray(value) ? value : []; // Return this result and finish the current function.
  } catch { // Recover safely if the protected operation fails.
    return []; // Return this result and finish the current function.
  } // Close the current function, callback, block, or expression.
})(); // Close the current function, callback, block, or expression.
const state = {tracks:[...musicTracks],index:-1,view:'home',playlist:null,history:[{view:'home',playlist:null}],historyIndex:0,query:'',shuffle:false,repeat:false,liked:new Set(savedLikes.filter(id=>musicTracks.some(track=>track.id===id)))}; // Create the central object that stores the current tracks, view, playback modes, history, and likes.
const playlists={chill:{title:'Late Night Vibes',genres:['Jazz','Reggae','Pop']},energy:{title:'Feel Good Mix',genres:['African','Disco','Latin','Rock']},focus:{title:'Deep Focus',genres:['Electronica','Funk','Jazz']}}; // Define each playlist name and the genres it includes.
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character])); // Create a helper that makes generated text safe before inserting it into HTML.
const timeLabel = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '0:00'; // Create a helper that formats seconds as minutes and seconds.
const currentTrack = () => state.tracks[state.index]; // Create a helper that returns the currently selected track.
// Blank line separating sections so the file is easier to read.
function renderFeatured(){ // Define the renderFeatured function for reuse.
  $('#featured-grid').innerHTML=musicTracks.slice(0,4).map(track=>`<button class="featured-card" data-play="${track.id}" aria-label="Play ${escapeHtml(track.title)}"><div class="card-art ${track.art}"><span class="card-shape">${track.symbol}</span><span class="card-play"><svg><use href="#i-play"/></svg></span></div><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.genre)} · Kevin MacLeod</small></button>`).join(''); // Generate and insert interface markup from the current data.
} // Close the current function, callback, block, or expression.
function visibleTracks(){ // Define the visibleTracks function for reuse.
  let tracks=state.view==='liked'?state.tracks.filter(track=>state.liked.has(track.id)):state.view==='library'?state.tracks.filter(track=>track.local):state.view==='playlist'?state.tracks.filter(track=>playlists[state.playlist].genres.includes(track.genre)):state.tracks; // Declare a variable whose value may change.
  if(state.query)tracks=tracks.filter(track=>`${track.title} ${track.artist} ${track.genre}`.toLowerCase().includes(state.query.toLowerCase())); // Check a condition before running the attached instruction.
  return tracks; // Return this result and finish the current function.
} // Close the current function, callback, block, or expression.
function renderTracks(){ // Define the renderTracks function for reuse.
  const tracks=visibleTracks(); // Declare a constant reference used by the surrounding logic.
  $('#track-list').innerHTML=tracks.length?tracks.map((track,position)=>`<div class="track-row ${currentTrack()?.id===track.id?'is-playing':''}" data-row="${track.id}"><span class="track-number">${String(position+1).padStart(2,'0')}</span><div class="track-title-cell"><div class="row-art ${track.art}">${track.symbol}</div><div class="row-meta"><strong>${escapeHtml(track.title)}</strong><span>${escapeHtml(track.artist)}</span></div></div><span class="genre">${escapeHtml(track.genre)}</span><span class="track-time">${timeLabel(track.duration)}</span><button class="row-like ${state.liked.has(track.id)?'liked':''}" data-like="${track.id}" aria-label="${state.liked.has(track.id)?'Unlike':'Like'} ${escapeHtml(track.title)}"><svg><use href="#i-heart"/></svg></button></div>`).join(''):`<div class="empty-state">${state.view==='liked'?'No liked songs yet. Tap a heart to save one.':state.view==='library'?'Your library is empty. Add audio files to get started.':'No tracks found. Try another search.'}</div>`; // Generate and insert interface markup from the current data.
  $('#liked-count').textContent=state.liked.size; // Update visible text safely.
  $('#liked-word').textContent=state.liked.size===1?'song':'songs'; // Update visible text safely.
} // Close the current function, callback, block, or expression.
function setView(view,playlist=null,record=true){ // Define the setView function for reuse.
  state.view=view;state.playlist=playlist;state.query=''; // Continue the application logic by calculating data, changing state, or controlling the interface.
  if(record){state.history=state.history.slice(0,state.historyIndex+1);state.history.push({view,playlist});state.historyIndex=state.history.length-1;} // Check a condition before running the attached instruction.
  document.querySelectorAll('[data-view]').forEach(button=>{ // Continue the application logic by calculating data, changing state, or controlling the interface.
    const isActive=button.dataset.view===view; // Declare a constant reference used by the surrounding logic.
    button.classList.toggle('active',isActive); // Update a CSS class to reflect the current interface state.
    if(isActive)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current'); // Update an HTML or accessibility attribute.
  }); // Close the current function, callback, block, or expression.
  document.querySelectorAll('[data-playlist]').forEach(button=>button.classList.toggle('selected',view==='playlist'&&button.dataset.playlist===playlist)); // Update a CSS class to reflect the current interface state.
  $('#hero').hidden=view!=='home';$('#featured-section').hidden=view!=='home';$('#artists-section').hidden=view!=='home'; // Continue the application logic by calculating data, changing state, or controlling the interface.
  const headings={home:['YOUR DAILY MIX','Songs to play'],search:['SEARCH','Find your next song'],library:['LOCAL FILES','Your music'],liked:['PLAYLIST','Liked Songs'],playlist:['PLAYLIST',playlists[playlist]?.title||'Playlist']}; // Declare a constant reference used by the surrounding logic.
  $('#track-kicker').textContent=headings[view][0]; // Update visible text safely.
  $('#track-heading').innerHTML=`${headings[view][1]}<span class="accent-period">.</span>`; // Generate and insert interface markup from the current data.
  $('#show-all').hidden=view!=='home'; // Continue the application logic by calculating data, changing state, or controlling the interface.
  let box=$('.search-box');if(box)box.remove(); // Declare a variable whose value may change.
  if(view==='search'){ // Check a condition before running the attached instruction.
    box=document.createElement('label');box.className='search-box'; // Continue the application logic by calculating data, changing state, or controlling the interface.
    box.innerHTML='<svg><use href="#i-search"/></svg><input id="search-input" type="search" placeholder="Search songs, artists, or genres" aria-label="Search songs">'; // Generate and insert interface markup from the current data.
    $('#tracks-section .section-heading').after(box); // Continue the application logic by calculating data, changing state, or controlling the interface.
    $('#search-input').addEventListener('input',event=>{state.query=event.target.value;renderTracks();}); // Listen for this browser or user event and run the attached callback.
    $('#search-input').focus(); // Continue the application logic by calculating data, changing state, or controlling the interface.
  } // Close the current function, callback, block, or expression.
  renderTracks(); // Continue the application logic by calculating data, changing state, or controlling the interface.
  updateHistoryButtons(); // Continue the application logic by calculating data, changing state, or controlling the interface.
  if(view!=='home')$('#tracks-section').scrollIntoView({behavior:'smooth',block:'start'}); // Check a condition before running the attached instruction.
} // Close the current function, callback, block, or expression.
function updateHistoryButtons(){ // Define the updateHistoryButtons function for reuse.
  $('#go-back').disabled=state.historyIndex===0; // Continue the application logic by calculating data, changing state, or controlling the interface.
  $('#go-forward').disabled=state.historyIndex===state.history.length-1; // Continue the application logic by calculating data, changing state, or controlling the interface.
} // Close the current function, callback, block, or expression.
function updateNowPlaying(){ // Define the updateNowPlaying function for reuse.
  const track=currentTrack();if(!track)return; // Declare a constant reference used by the surrounding logic.
  $('#now-title').textContent=$('#player-title').textContent=track.title; // Update visible text safely.
  $('#now-artist').textContent=$('#player-artist').textContent=track.artist; // Update visible text safely.
  $('#now-description').textContent=track.description; // Update visible text safely.
  const credit=$('#track-credit'); // Declare a constant reference used by the surrounding logic.
  credit.hidden=!!track.local; // Continue the application logic by calculating data, changing state, or controlling the interface.
  if(!track.local){credit.href=track.sourceUrl;credit.textContent=`“${track.title}” by Kevin MacLeod · CC BY 4.0 ↗`;} // Update visible text safely.
  $('#now-art').className=`now-art ${track.art}`;$('#now-art .art-shape').textContent=track.symbol; // Update visible text safely.
  $('#now-art .art-code').textContent=`MUSIC / ${String(state.index+1).padStart(2,'0')}`; // Update visible text safely.
  $('#player-art').className=`player-art ${track.art}`;$('#player-art').textContent=track.symbol; // Update visible text safely.
  for(const button of [$('#now-like'),$('#player-like')]){ // Repeat the enclosed instructions for each matching item.
    button.classList.toggle('liked',state.liked.has(track.id)); // Update a CSS class to reflect the current interface state.
    button.setAttribute('aria-label',`${state.liked.has(track.id)?'Unlike':'Like'} ${track.title}`); // Update an HTML or accessibility attribute.
  } // Close the current function, callback, block, or expression.
  $('#duration').textContent=timeLabel(track.duration); // Update visible text safely.
  const next=state.tracks[(state.index+1)%state.tracks.length]; // Declare a constant reference used by the surrounding logic.
  $('#next-track-label').textContent=next?`${next.title} · ${next.artist}`:'Press play to get started'; // Update visible text safely.
  renderQueue(); // Continue the application logic by calculating data, changing state, or controlling the interface.
  renderTracks(); // Continue the application logic by calculating data, changing state, or controlling the interface.
} // Close the current function, callback, block, or expression.
function renderQueue(){ // Define the renderQueue function for reuse.
  const list=$('#queue-list');if(!list)return; // Declare a constant reference used by the surrounding logic.
  const upcoming=state.index<0?state.tracks:state.tracks.slice(state.index+1).concat(state.tracks.slice(0,state.index)); // Declare a constant reference used by the surrounding logic.
  list.innerHTML=upcoming.slice(0,8).map(track=>`<button class="queue-item" data-queue="${track.id}"><span class="row-art ${track.art}">${track.symbol}</span><span><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.artist)}</small></span></button>`).join(''); // Generate and insert interface markup from the current data.
} // Close the current function, callback, block, or expression.
function updatePlayButton(){ // Define the updatePlayButton function for reuse.
  const playing=!audio.paused; // Pause the single audio element.
  $('#play-pause').innerHTML=`<svg><use href="#i-${playing?'pause':'play'}"/></svg>`; // Generate and insert interface markup from the current data.
  $('#play-pause').setAttribute('aria-label',playing?'Pause':'Play'); // Update an HTML or accessibility attribute.
} // Close the current function, callback, block, or expression.
function playIndex(index){ // Define the playIndex function for reuse.
  if(index<0||index>=state.tracks.length)return; // Check a condition before running the attached instruction.
  state.index=index; // Continue the application logic by calculating data, changing state, or controlling the interface.
  const track=currentTrack(); // Declare a constant reference used by the surrounding logic.
  audio.src=track.local?track.url:track.audioUrl; // Continue the application logic by calculating data, changing state, or controlling the interface.
  audio.play().catch(()=>{$('#now-description').textContent='Could not start this track. Check your connection and try another song.';updatePlayButton();}); // Update visible text safely.
  updateNowPlaying();updatePlayButton(); // Continue the application logic by calculating data, changing state, or controlling the interface.
} // Close the current function, callback, block, or expression.
function nextTrack(direction=1){ // Define the nextTrack function for reuse.
  if(!state.tracks.length)return; // Check a condition before running the attached instruction.
  if(state.shuffle&&direction>0&&state.tracks.length>1){ // Check a condition before running the attached instruction.
    let next;do{next=Math.floor(Math.random()*state.tracks.length)}while(next===state.index); // Declare a variable whose value may change.
    playIndex(next);return; // Continue the application logic by calculating data, changing state, or controlling the interface.
  } // Close the current function, callback, block, or expression.
  playIndex((state.index+direction+state.tracks.length)%state.tracks.length); // Continue the application logic by calculating data, changing state, or controlling the interface.
} // Close the current function, callback, block, or expression.
function togglePlay(){ // Define the togglePlay function for reuse.
  if(state.index<0){playIndex(Math.floor(Math.random()*state.tracks.length));return;} // Check a condition before running the attached instruction.
  if(audio.paused)audio.play().catch(()=>{});else audio.pause(); // Start playback using the single audio element.
} // Close the current function, callback, block, or expression.
function toggleLike(id){ // Define the toggleLike function for reuse.
  if(state.liked.has(id))state.liked.delete(id);else state.liked.add(id); // Check a condition before running the attached instruction.
  localStorage.setItem('soundspace-likes',JSON.stringify([...state.liked])); // Read or save liked songs in the browser.
  renderTracks();updateNowPlaying(); // Continue the application logic by calculating data, changing state, or controlling the interface.
} // Close the current function, callback, block, or expression.
function openUpload(){$('#file-input').click();} // Define the openUpload function for reuse.
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view))); // Listen for this browser or user event and run the attached callback.
$('.brand').addEventListener('click',event=>{event.preventDefault();setView('home')}); // Listen for this browser or user event and run the attached callback.
document.querySelectorAll('[data-playlist]').forEach(button=>button.addEventListener('click',()=>setView('playlist',button.dataset.playlist))); // Listen for this browser or user event and run the attached callback.
$('#quick-grid').addEventListener('click',event=>{if(event.target.closest('#random-play')){playIndex(Math.floor(Math.random()*state.tracks.length));return;}const play=event.target.closest('[data-play]');if(play)playIndex(state.tracks.findIndex(track=>track.id===play.dataset.play));}); // Listen for this browser or user event and run the attached callback.
$('#go-back').addEventListener('click',()=>{if(state.historyIndex>0){const previous=state.history[--state.historyIndex];setView(previous.view,previous.playlist,false)}}); // Listen for this browser or user event and run the attached callback.
$('#go-forward').addEventListener('click',()=>{if(state.historyIndex<state.history.length-1){const next=state.history[++state.historyIndex];setView(next.view,next.playlist,false)}}); // Listen for this browser or user event and run the attached callback.
$('#upload-side').addEventListener('click',openUpload);$('#upload-main').addEventListener('click',openUpload); // Listen for this browser or user event and run the attached callback.
$('#mobile-upload').addEventListener('click',openUpload); // Listen for this browser or user event and run the attached callback.
$('#file-input').addEventListener('change',event=>{ // Listen for this browser or user event and run the attached callback.
  const files=[...event.target.files].filter(file=>file.type.startsWith('audio/')); // Declare a constant reference used by the surrounding logic.
  files.forEach(file=>{ // Continue the application logic by calculating data, changing state, or controlling the interface.
    const uniqueId=crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`; // Declare a constant reference used by the surrounding logic.
    state.tracks.push({id:`local-${uniqueId}`,title:file.name.replace(/\.[^.]+$/,''),artist:'Your music',genre:'Local file',duration:0,art:'art-green',symbol:'♫',description:'A track you added from your device. It stays available until you close or reload this page.',local:true,url:URL.createObjectURL(file)}); // Create a temporary URL that lets the browser play an uploaded file.
  }); // Close the current function, callback, block, or expression.
  event.target.value='';if(files.length)setView('library'); // Continue the application logic by calculating data, changing state, or controlling the interface.
}); // Close the current function, callback, block, or expression.
$('#featured-grid').addEventListener('click',event=>{const card=event.target.closest('[data-play]');if(card)playIndex(state.tracks.findIndex(track=>track.id===card.dataset.play));}); // Listen for this browser or user event and run the attached callback.
$('#track-list').addEventListener('click',event=>{ // Listen for this browser or user event and run the attached callback.
  const like=event.target.closest('[data-like]');if(like){toggleLike(like.dataset.like);return;} // Declare a constant reference used by the surrounding logic.
  const row=event.target.closest('[data-row]');if(row)playIndex(state.tracks.findIndex(track=>track.id===row.dataset.row)); // Declare a constant reference used by the surrounding logic.
}); // Close the current function, callback, block, or expression.
$('#now-like').addEventListener('click',()=>{if(currentTrack())toggleLike(currentTrack().id)}); // Listen for this browser or user event and run the attached callback.
$('#player-like').addEventListener('click',()=>{if(currentTrack())toggleLike(currentTrack().id)}); // Listen for this browser or user event and run the attached callback.
$('#show-all').addEventListener('click',()=>setView('search')); // Listen for this browser or user event and run the attached callback.
$('#queue-toggle').addEventListener('click',()=>{$('#queue-drawer').hidden=!$('#queue-drawer').hidden;renderQueue()}); // Listen for this browser or user event and run the attached callback.
$('#show-queue').addEventListener('click',()=>{$('#queue-drawer').hidden=false;renderQueue();$('#close-queue').focus()}); // Listen for this browser or user event and run the attached callback.
$('#close-queue').addEventListener('click',()=>{$('#queue-drawer').hidden=true}); // Listen for this browser or user event and run the attached callback.
$('#queue-list').addEventListener('click',event=>{const row=event.target.closest('[data-queue]');if(row){playIndex(state.tracks.findIndex(track=>track.id===row.dataset.queue));$('#queue-drawer').hidden=true}}); // Listen for this browser or user event and run the attached callback.
$('#close-now').addEventListener('click',()=>{const shell=$('.app-shell');shell.classList.remove('show-now');shell.classList.add('now-hidden');$('.now-panel').hidden=true}); // Listen for this browser or user event and run the attached callback.
$('#now-toggle').addEventListener('click',()=>{const shell=$('.app-shell');shell.classList.remove('now-hidden');shell.classList.add('show-now');$('.now-panel').hidden=false}); // Listen for this browser or user event and run the attached callback.
$('#play-pause').addEventListener('click',togglePlay); // Listen for this browser or user event and run the attached callback.
$('#previous').addEventListener('click',()=>{if(audio.currentTime>3)audio.currentTime=0;else nextTrack(-1)}); // Listen for this browser or user event and run the attached callback.
$('#next').addEventListener('click',()=>nextTrack()); // Listen for this browser or user event and run the attached callback.
$('#shuffle').addEventListener('click',()=>{state.shuffle=!state.shuffle;$('#shuffle').classList.toggle('active',state.shuffle);$('#shuffle').setAttribute('aria-pressed',state.shuffle)}); // Listen for this browser or user event and run the attached callback.
$('#repeat').addEventListener('click',()=>{state.repeat=!state.repeat;$('#repeat').classList.toggle('active',state.repeat);$('#repeat').setAttribute('aria-pressed',state.repeat)}); // Listen for this browser or user event and run the attached callback.
$('#seek').addEventListener('input',event=>{if(audio.duration)audio.currentTime=audio.duration*event.target.value/100}); // Listen for this browser or user event and run the attached callback.
$('#volume').addEventListener('input',event=>audio.volume=event.target.value/100); // Listen for this browser or user event and run the attached callback.
audio.addEventListener('play',updatePlayButton);audio.addEventListener('pause',updatePlayButton); // Listen for this browser or user event and run the attached callback.
audio.addEventListener('loadedmetadata',()=>{if(currentTrack()&&Number.isFinite(audio.duration)){currentTrack().duration=audio.duration;$('#duration').textContent=timeLabel(audio.duration);renderTracks()}}); // Listen for this browser or user event and run the attached callback.
audio.addEventListener('error',()=>{if(currentTrack())$('#now-description').textContent='This track could not load. Check your connection and try another song.'}); // Listen for this browser or user event and run the attached callback.
audio.addEventListener('timeupdate',()=>{$('#current-time').textContent=timeLabel(audio.currentTime);$('#seek').value=audio.duration?audio.currentTime/audio.duration*100:0}); // Listen for this browser or user event and run the attached callback.
audio.addEventListener('ended',()=>{if(state.repeat){audio.currentTime=0;audio.play()}else nextTrack()}); // Listen for this browser or user event and run the attached callback.
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)){event.preventDefault();togglePlay()}}); // Listen for this browser or user event and run the attached callback.
document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('#queue-drawer').hidden=true}}); // Listen for this browser or user event and run the attached callback.
window.addEventListener('beforeunload',()=>state.tracks.filter(track=>track.local).forEach(track=>URL.revokeObjectURL(track.url))); // Listen for this browser or user event and run the attached callback.
audio.volume=.7; // Continue the application logic by calculating data, changing state, or controlling the interface.
const hour=new Date().getHours();$('#greeting').textContent=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'; // Update visible text safely.
renderFeatured();renderTracks();renderQueue();updateHistoryButtons(); // Continue the application logic by calculating data, changing state, or controlling the interface.
