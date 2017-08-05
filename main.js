
$(document).ready(function(){
  
  // add global user info
  var $users = streams.users;
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

  var index = 0;
  var streamRestrict = false;
  var currentUser = '';
  
  // constant stream interval to grab new tweets
  setInterval(function() {

    // different action for single user vs all users
    if(streamRestrict) {
      var len = $users[currentUser].length;
      var tweet = $users[currentUser][len-1];
      var delayParameter2 = $users.data[currentUser].tweetCount;
      var delayParameter1 = len;
    } else {
      var tweet = streams.home[index];
      var delayParameter1 = streams.home.length - 5;
      var delayParameter2 = index;
    }

    if(delayParameter1 <= delayParameter2){
      setTimeout(function(){
      }, 5000);
    } else {

    let $first = $('.first');

    var $tweetDetails = $(
      '<li class="tweetDetails ' + tweet.user + ' tweetVisibility tweetClickListener"><div><strong>' 
      + $users.data[tweet.user].userName + '</strong> <span class="userHandle">@' 
      + tweet.user + '</span> &middot; ' + getTime(tweet) + '</div>' 
      +'<div>'+ tweet.message + '</div></li>');

    $first.prepend($tweetDetails);

    if(streamRestrict) { 
      $users.data[currentUser].tweetCount = len;
    } else {
      index++; 
    }

    }
  }, 2500);

  // faux page change on user click 
  $('ul').on('click', '.tweetClickListener', function() {
    let getUserName = $(this).attr('class').split(' ')[1];

    $('#card-pic').fadeOut(175, function() {
      $('#card-pic').attr('src', $users.data[getUserName].cardpic);
      $('#card-pic').attr('alt', $users.data[getUserName].userName);            
      $('#card-pic').fadeTo(300, 1);
    });

    $('#card-userNameLink, #card-userHandleLink, #card-profileDescription').fadeOut(175, function() {
      $('#card-userNameLink, #card-userHandleLink').removeClass();
      $('#card-userNameLink, #card-userHandleLink').addClass('tweetClickListener ' + getUserName);
      $('#card-userNameLink').text($users.data[getUserName].userName)
      $('#card-userHandleLink').text('@'+getUserName)
      $('#card-profileDescription').text('The Twittler Page of ' + $users.data[getUserName].userName);
      $('#card-userNameLink, #card-userHandleLink, #card-profileDescription').fadeTo(200, 1);
    });

    $('#poster-pic').fadeOut(50, function() {
      $('#poster-pic').attr('src', $users.data[getUserName].poster);
      $('#poster-pic').fadeTo(300, 1);
    });

    if(getUserName === 'eaplato'){
      $('.tweetVisibility').show();
      streamRestrict = false;
    } else {
      $('.tweetVisibility').not('.' + getUserName).hide();
      showPage(getUserName);
    }
  });

  function showPage(input){
    setStreamRestriction(input);  
    let streamLength = $users[input].length;

    for(var i = 0; i < streamLength; i++) {

        let tweet = $users[input][i];

        let $first = $('.first');

        let $tweetDetails = $(
          '<li class="tweetDetails ' + input + ' tweetVisibility tweetClickListener"><div><strong>' 
          + $users.data[input].userName + '</strong> <span class="userHandle">@' 
          + input + '</span> &middot; ' + getTime(tweet) + '</div>' 
          +'<div>'+ tweet.message + '</div></li>');

        $first.prepend($tweetDetails);
    }
    $users.data[input].tweetCount = streamLength;
  };

  function setStreamRestriction(inputName){
    streamRestrict = true;
    currentUser = inputName;
  };

  // get time helper function
  function getTime(tweetInput){
    let timeTweetedInput = tweetInput.created_at.toString();
    let reformatDate = timeTweetedInput.slice(4, 24);
    let timeAgo = moment(reformatDate, 'MMM DD YYYY h:mma ZZ').fromNow();
    return timeAgo;
  };

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

  $(".small-profile-pic").bind({
     mousemove : changeTooltipPosition,
     mouseenter : showTooltip,
     mouseleave: hideTooltip
  });

});