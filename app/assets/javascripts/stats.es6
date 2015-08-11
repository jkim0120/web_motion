$(document).on('ready page:load', function() {
  $(window).resize(resizeCanvas)
  function resizeCanvas() {
    var canvasWidth = $('.canvas').width()
  }

  // SVG Script
  var testCanvas = d3.select('.canvas')
  var canvasWidth = $('.canvas').width()
  var canvasHeight = $('.canvas').height()
  var pointer

  function makeCircle(cx, cy, r) {
    var data = [{'x': cx, 'y': cy, 'r': r}]
    var pointer =  testCanvas.selectAll('circle').data(data).enter().append('circle');
    pointer.attr('cx', function(d) { return d.x })
           .attr('cy', function(d) { return d.y })
           .attr('r', function(d) { return d.r })
    return pointer
  }

  // function

  // Tracker Script
  var x
  var y
  var r
  var eventSource = new EventSource(`https://api.particle.io/v1/devices/${ gon.id }/events/?access_token=${ gon.token }`);

  eventSource.addEventListener('Coordinates', function(e) {
    var rawData = JSON.parse(e.data)
    var parsedData = JSON.parse(rawData.data)
    $('.x').html(parsedData.X)
    $('.y').html(parsedData.Y)
    $('.size').html(parsedData.Size)
    x = canvasWidth * parsedData.X / 1000
    y = canvasHeight * parsedData.Y / 800
    r = parsedData.Size * 7

    if (pointer === undefined) pointer = makeCircle(x, y, r)

    pointer.transition().attr('cx', x).attr('cy', y).attr('r', r).ease('cubic-in')
  }, false)
})