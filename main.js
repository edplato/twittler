
$(document).ready(function(){
  
  // add global user info
  var $users = streams.users;
  visitor = 'eaplato';

  $users.data = {};

  $users.eaplato = [];
  $users.data.eaplato = {};
  $users.data.eaplato.poster = 'assets/images/arm-sound-retro-audio-19951.jpg';
  $users.data.eaplato.cardpic = 'assets/images/eaplato.jpg';
  $users.data.eaplato.userName = 'Ed Plato';     
  $users.data.eaplato.tweetCount = 0;

  $users.data.mracus = {};
  $users.data.mracus.poster = 'assets/images/pexels-photo-462443.jpeg';
  $users.data.mracus.cardpic = 'assets/images/mracus.jpeg';
  $users.data.mracus.userName = 'Marcus Phillips';
  $users.data.mracus.tweetCount = 0;
  
  $users.data.sharksforcheap = {};
  $users.data.sharksforcheap.poster = 'assets/images/pexels-photo-433604.jpeg';
  $users.data.sharksforcheap.cardpic = 'assets/images/sharksforcheap.jpeg';
  $users.data.sharksforcheap.userName = 'Anthony Phillips';
  $users.data.sharksforcheap.tweetCount = 0;

  $users.data.shawndrost = {};
  $users.data.shawndrost.poster = 'assets/images/pexels-photo-374777.jpeg';
  $users.data.shawndrost.cardpic = 'assets/images/shawndrost.jpg';
  $users.data.shawndrost.userName = 'Shawn Drost';
  $users.data.shawndrost.tweetCount = 0;

  $users.data.douglascalhoun = {};
  $users.data.douglascalhoun.poster = 'assets/images/pexels-photo-327231.jpeg';
  $users.data.douglascalhoun.cardpic = 'assets/images/douglascalhoun.jpg';
  $users.data.douglascalhoun.userName = 'Douglas Calhoun';
  $users.data.douglascalhoun.tweetCount = 0;

  streams.topHashes = {};

  var index = 0;
  var streamRestrict = false;
  var currentUser = '';
  
  // initial populate of tweets to fill page on load
  while(index <= 10){
    let tweet = streams.home[index];
    let $first = $('.first');
    let $tweetDetails = makeTweet(tweet);
    $($tweetDetails).hide().prependTo($first).fadeIn('slow');
    index++;
  };

  // initial populate of top hashes
  showTopHashes();

  // constant stream interval to grab new tweets
  setInterval(function() {

    // different action for single user vs all user stream
    if(streamRestrict) {
      var len = $users[currentUser].length;
      var tweet = $users[currentUser][len-1];
      var delayParameter2 = $users.data[currentUser].tweetCount;
      var delayParameter1 = len;
      var $tweetDetails = makeTweet(tweet, 'singleStream');
    } else {
      var tweet = streams.home[index];
      var delayParameter1 = streams.home.length - 5;
      var delayParameter2 = index;
      var $tweetDetails = makeTweet(tweet);
    }

    // delay to allow stream to catch up if running low
    if(delayParameter1 <= delayParameter2){
      setTimeout(function(){
      }, 2000);
    } else {

    // prepend tweet top top of stream
    let $first = $('.first');
    $($tweetDetails).hide().prependTo($first).fadeIn('slow');

    // counter based on single user vs all user stream
    if(streamRestrict) { 
      $users.data[currentUser].tweetCount = len;
    } else {
      index++; 
    }

    }
  }, 2500);

  // update relative tweet time 
  function updateTime(){
    $('.tweetTime').each(function() {
      let timeCreated = $(this).data('timemade');
      let getRelativeTime = getTime(timeCreated);
      $(this).text(getRelativeTime);
    })
  };

    // timer to update tweet time every minute
  setInterval(function() {
    updateTime();
  }, 60000);

  // faux page change on user click 
  $('ul').on('click', '.tweetClickListener', function() {
    // get user name that was clicked
    let getUserName = $(this).attr('class').split(' ')[1];

    if(currentUser !== getUserName){
      // replace card user image
      $('#card-pic').fadeOut(175, function() {
        $('#card-pic').attr('src', $users.data[getUserName].cardpic);
        $('#card-pic').attr('alt', $users.data[getUserName].userName);            
        $('#card-pic').fadeTo(300, 1);
      });

      // replace card name, link and description
      $('#card-userNameLink, #card-userHandleLink, #card-profileDescription').fadeOut(175, function() {
        $('#card-userNameLink, #card-userHandleLink').removeClass();
        $('#card-userNameLink, #card-userHandleLink').addClass('tweetClickListener ' + getUserName);
        $('#card-userNameLink').text($users.data[getUserName].userName)
        $('#card-userHandleLink').text('@'+getUserName)
        $('#card-profileDescription').text('The Twittler Page of ' + $users.data[getUserName].userName);
        $('#card-userNameLink, #card-userHandleLink, #card-profileDescription').fadeTo(200, 1);
      });

      // replace above feed poster image
      $('#poster-pic').fadeOut(50, function() {
        $('#poster-pic').attr('src', $users.data[getUserName].poster);
        $('#poster-pic').fadeTo(300, 1);
      });

      // my all user stream vs. individual user streams
      if(getUserName === 'eaplato'){
        $('.tweetVisibility').show();
        $('.singleStream').hide();
        streamRestrict = false;
        currentUser = 'eaplato';
      } else {
        $('.tweetVisibility').not('.' + getUserName).hide();
        showPage(getUserName);
      }
      updateTime();
    }
  });

  // display single user page
  function showPage(input){
    setStreamRestriction(input);  
    let streamLength = $users[input].length;

    for(var i = 0; i < streamLength; i++) {

        let tweet = $users[input][i];
        let $first = $('.first');
        let $tweetDetails = makeTweet(tweet, 'singleStream');
        $($tweetDetails).hide().prependTo($first).fadeIn('slow');
    }
    $users.data[input].tweetCount = streamLength;
  };

  // restrict the stream to single user and set that user 
  function setStreamRestriction(inputName){
    streamRestrict = true;
    currentUser = inputName;
  };

  // get time helper function
  function getTime(tweetInput){
    let timeTweetedInput = tweetInput.toString();
    let reformatDate = timeTweetedInput.slice(4, 24);
    let timeAgo = moment(reformatDate, 'MMM DD YYYY h:mma ZZ').fromNow();
    return timeAgo;
  };

  // make tweet function
  function makeTweet(tweet, singleStream){
    let singleStreamClass = !singleStream ? '' : singleStream;
    return $(
          '<li class="tweetDetails ' + tweet.user + ' tweetVisibility tweetClickListener ' + singleStreamClass 
          + '"><div class="tweetProfileImage"><img src='+ $users.data[tweet.user].cardpic +' class="small-profile-pic"></div><div class="tweetMessageBox"><strong>' 
          + $users.data[tweet.user].userName + '</strong> <span>@' 
          + tweet.user + '</span> &middot; <span class="tweetTime" data-timemade="' + tweet.created_at +'">' + getTime(tweet.created_at) + '</span></div>' 
          + '<div>'+ tweet.message + '</div></li>');
  };

  // tweet modal
  $('#header-tweet-button').on('click', function() {
    $('.tweetModal').fadeIn(200);
    // reset tweet box\
    $('#modal-textarea').val('');
    $('#modal-charRemaining').text(140 + ' characters remaining');
    $('#modal-emptyWarning').hide();

    // key up to track characters remaining - max length prevents >140 char
    $('#modal-textarea').on('keyup', function(){
      let tweetText = $('#modal-textarea').val();
      let charRemaining = tweetText.length;
      $('#modal-charRemaining').text(140-charRemaining + ' characters remaining');
    });

  });

  $('.close').on('click', function() {
    $('.tweetModal').fadeOut(400);
  });

  // add tweet from user account on submit
  $('#modal-submit').on('click', function(e) {
    e.preventDefault();
    let message = $('#modal-textarea').val();
    // handle empty submit warning
    if(message.length === 0){
      $('#modal-emptyWarning').show();
    } else {
      writeTweet(message);
      let streamLength = $users.eaplato.length;
      $users.eaplato[streamLength-1].created_at = new Date();
      $('.tweetModal').fadeOut(400);
    }
  });

  // prevent default submit reload behavior for search box in nav
  $('.form-search').on('submit', function(e) {
    e.preventDefault();
  });

  // prevent page jump on a tag click
  $('a').on('click', function(e) {
    e.preventDefault();
  });

  // top hashes in tweets
  // find hashes in tweet messages and add to topHashes object
  function searchTopHashes(){
    let tweets = streams.home;
    for(var i = 0; i < tweets.length; i++){
      if(tweets[i].message.includes('#')){
        let hashStart = tweets[i].message.indexOf('#');
        let hashCut = tweets[i].message.slice(hashStart+1);

        if(streams.topHashes[hashCut] !== undefined){
          streams.topHashes[hashCut] += 1;
        } else {
          streams.topHashes[hashCut] = 1;
        }

      } else {
        continue;
      }
    }
  };

  // sort hashses in topHashes object and return sorted array
  function sortTopHashes(){
    return Object.keys(streams.topHashes).sort(function(a,b) {
      return streams.topHashes[a] - streams.topHashes[b]
    });
  }

  // append li items of <= top 5 hashes
  function showTopHashes(){
    searchTopHashes();
    $('.addedTopHash').remove();
    let topHashes = sortTopHashes();
    let len = topHashes.length <= 5 ? topHashes.length : 5;

    for(var i = 0; i < len; i++){
      $('#topHashes').append('<li class="addedTopHash">#'+topHashes[i]+'</li>');
    }
  };

  $('#refreshTopHashes').on('click', showTopHashes);

  // external tool tip for hover on small pictures
  var changeTooltipPosition = function(event) {
    var tooltipX = event.pageX - 8;
    var tooltipY = event.pageY + 8;
    $('div.tooltip').css({top: tooltipY, left: tooltipX});
  };

  var showTooltip = function(event) {
    let altName = $(this).attr('alt');
    $('div.tooltip').remove();
    $('<div class="tooltip">' + altName + '</div>')
            .appendTo('body');
    changeTooltipPosition(event);
  };

  var hideTooltip = function() {
     $('div.tooltip').remove();
  };

  $(".toolTip").bind({
     mousemove : changeTooltipPosition,
     mouseenter : showTooltip,
     mouseleave: hideTooltip
  });

});