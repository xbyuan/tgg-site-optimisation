$(document).ready(function() {
    $('#auroraBody').load('aurora-resource/aurora-body.html');
    $('#newMasthead').load('refactor/masthead.html');
    function loadSlashingPrice() {
    	$('#slashingPrice').load('aurora-resource/slashing-price.html');
	}
	setTimeout(loadSlashingPrice, 1000);
});
