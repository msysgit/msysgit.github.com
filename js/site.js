$(function() {
	//If the browser supports svg and the img element has data-svg="true", set the img src url to point to the svg version of the image
	if(Modernizr.svg) {
		
		var svgImages = $("img").filter(function(index) {
			return $(this).data("svg");
		});
		
		$.each(svgImages, function(index, value) {
			var url = $(value).attr("src");
			var len = url.length;
			
			var extension = url.substring(len-3, len);
			
			var newUrl = url.replace(extension, "svg");
			
			$(value).attr("src", newUrl);
		});
		
	}
});