__samlTools={
    getSAMLResponse: function(){
        var frm = document.getElementById('appForm');
        if (!frm) {
            // alert('no form');
            return null
        }

        var el = frm.querySelector('input[name="SAMLResponse"]')
        if (!el) {
            // alert('no control')
            return null
        }
        // alert(el.value);
        return el.value;
    }
}
