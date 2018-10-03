<template>
    <div>
        <button id="connect-orcid-button" v-on:click="openORCID()"><img id="orcid-id-icon" src="https://orcid.org/sites/default/files/images/orcid_24x24.png" width="24" height="24" alt="ORCID iD icon"/>Register or Connect your ORCID iD</button>
    </div>
</template>

<script>

    var oauthWindow;
	oauthWindow;

    export default {
        name: 'ORCID',
        methods: {
            openORCID: function() {
                oauthWindow = window.open("https://sandbox.orcid.org/oauth/authorize?client_id=[YOUR CLIENT ID]response_type=code&scope=/authenticate&show_login=false&redirect_uri=https://yourwebsite.edu/RedirectURI", "_blank", "toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500");
            }
        }
    }
</script>

<style scoped>

#connect-orcid-button{
	border: 1px solid #D3D3D3;
	padding: .3em;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 1px 1px 3px #999;
	cursor: pointer;
	color: #999;
	font-weight: bold;
	font-size: .8em;
	line-height: 24px;
	vertical-align: middle;
}

#connect-orcid-button:hover{
	border: 1px solid #338caf;
	color: #338caf;
}

#orcid-id-icon{
	display: block;
	margin: 0 .5em 0 0;
	padding: 0;
	float: left;
}
</style>



