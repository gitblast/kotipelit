(this.webpackJsonpkotipelit=this.webpackJsonpkotipelit||[]).push([[0],{15:function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return n}));var n=function(t){e&&Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}),0}}).call(this,a(70))},172:function(e,t,a){e.exports=a(234)},230:function(e,t){},234:function(e,t,a){"use strict";a.r(t);var n,r,c,o,i,l,u=a(0),s=a.n(u),E=a(14),m=a.n(E),d=a(9),p=a(50),f=a(140),v=a(12),g=a.n(v),S=a(24),O=a(6);!function(e){e.SANAKIERTO="sanakierto"}(n||(n={})),function(e){e.RUNNING="Running",e.WAITING="Waiting for players",e.UPCOMING="Upcoming",e.FINISHED="Finished"}(r||(r={})),function(e){e.SET_ACTIVE_GAME="SET_ACTIVE_GAME",e.INIT_GAMES_REQUEST="INIT_GAMES_REQUEST",e.INIT_GAMES_SUCCESS="INIT_GAMES_SUCCESS",e.INIT_GAMES_FAILURE="INIT_GAMES_FAILURE",e.ADD_GAME_REQUEST="ADD_GAME_REQUEST",e.ADD_GAME_SUCCESS="ADD_GAME_SUCCESS",e.ADD_GAME_FAILURE="ADD_GAME_FAILURE",e.DELETE_GAME_REQUEST="DELETE_GAME_REQUEST",e.DELETE_GAME_SUCCESS="DELETE_GAME_SUCCESS",e.DELETE_GAME_FAILURE="DELETE_GAME_FAILURE",e.LAUNCH_GAME="LAUNCH_GAME",e.UPDATE_ACTIVE_GAME="UPDATE_ACTIVE_GAME",e.LOGIN_REQUEST="LOGIN_REQUEST",e.LOGIN_SUCCESS="LOGIN_SUCCESS",e.LOGIN_FAILURE="LOGIN_FAILURE",e.LOGOUT="LOGOUT",e.SET_JITSI_TOKEN="SET_JITSI_TOKEN",e.SET_JITSI_ROOM="SET_JITSI_ROOM",e.SET_SOCKET="SET_SOCKET",e.INIT_CHANNELS_REQUEST="INIT_CHANNELS_REQUEST",e.INIT_CHANNELS_SUCCESS="INIT_CHANNELS_SUCCESS",e.INIT_CHANNELS_FAILURE="INIT_CHANNELS_FAILURE"}(c||(c={})),function(e){e.JOIN_GAME="join game",e.JOIN_SUCCESS="join success",e.JOIN_FAILURE="join failure",e.GAME_READY="game ready",e.GAME_STARTING="game starting",e.GAME_UPDATED="game updated"}(o||(o={})),function(e){e.JITSI_READY="jitsi ready",e.CREATE_ROOM="create room",e.START_GAME="start game",e.UPDATE_GAME="update game",e.CREATE_SUCCESS="create success",e.CREATE_FAILURE="create failure",e.START_SUCCESS="start success",e.START_FAILURE="start failure",e.UPDATE_SUCCESS="update success",e.UPDATE_FAILURE="update failure"}(i||(i={})),function(e){e.AUTH_REQUEST="authenticate",e.AUTHENTICATED="authenticated",e.UNAUTHORIZED="unauthorized",e.CONNECT="connect",e.PLAYER_JOINED="player joined"}(l||(l={}));var A=a(46),T=a.n(A),I=null,b={login:function(){var e=Object(S.a)(g.a.mark((function e(t,a){var n,r;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={username:t,password:a},e.next=3,T.a.post("/api/login",n);case 3:return r=e.sent,e.abrupt("return",r.data);case 5:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),setToken:function(e){I=e},getAuthHeader:function(){if(!I)throw new Error("K\xe4ytt\xe4j\xe4n token puuttuu");return"Bearer ".concat(I)},getAll:function(){var e=Object(S.a)(g.a.mark((function e(){var t;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("/api/users");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),getToken:function(){return I}},_={getAll:function(){var e=Object(S.a)(g.a.mark((function e(){var t,a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={headers:{Authorization:b.getAuthHeader()}},e.next=3,T.a.get("/api/games",t);case 3:return a=e.sent,e.abrupt("return",a.data);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),addNew:function(){var e=Object(S.a)(g.a.mark((function e(t){var a,n;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={headers:{Authorization:b.getAuthHeader()}},e.next=3,T.a.post("/api/games",t,a);case 3:return n=e.sent,e.abrupt("return",n.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),deleteGame:function(){var e=Object(S.a)(g.a.mark((function e(t){var a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={headers:{Authorization:b.getAuthHeader()}},e.next=3,T.a.delete("".concat("/api/games","/").concat(t),a);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},j={allGames:[],activeGame:null,loading:!1},h=function(e){switch(e.type){case n.SANAKIERTO:return Object(O.a)(Object(O.a)({},e),{},{status:r.WAITING,info:{turn:"TODO",round:1}});default:throw new Error("Something went wrong, expected a selectable game, got ".concat(e.type))}},N=function(e){return{type:c.INIT_GAMES_SUCCESS,payload:e}},y=function(e){return{type:c.SET_ACTIVE_GAME,payload:e}},C=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case c.INIT_GAMES_REQUEST:return Object(O.a)(Object(O.a)({},e),{},{loading:!0});case c.INIT_GAMES_SUCCESS:return Object(O.a)(Object(O.a)({},e),{},{allGames:t.payload,loading:!1});case c.INIT_GAMES_FAILURE:return Object(O.a)(Object(O.a)({},e),{},{loading:!1});case c.ADD_GAME_REQUEST:return Object(O.a)(Object(O.a)({},e),{},{loading:!0});case c.ADD_GAME_SUCCESS:return Object(O.a)(Object(O.a)({},e),{},{allGames:e.allGames.concat(t.payload),loading:!1});case c.ADD_GAME_FAILURE:return Object(O.a)(Object(O.a)({},e),{},{loading:!1});case c.DELETE_GAME_REQUEST:return Object(O.a)(Object(O.a)({},e),{},{loading:!0});case c.DELETE_GAME_SUCCESS:return Object(O.a)(Object(O.a)({},e),{},{allGames:e.allGames.filter((function(e){return e.id!==t.payload})),loading:!1});case c.DELETE_GAME_FAILURE:return Object(O.a)(Object(O.a)({},e),{},{loading:!1});case c.SET_ACTIVE_GAME:return Object(O.a)(Object(O.a)({},e),{},{activeGame:t.payload});case"LAUNCH_GAME":var a=e.allGames.find((function(e){return e.id===t.payload}));if(!a)throw new Error("Game not found");var n=h(a);return Object(O.a)(Object(O.a)({},e),{},{activeGame:n,allGames:e.allGames.map((function(e){return e.id===t.payload?Object(O.a)(Object(O.a)({},e),{},{status:r.WAITING}):e}))});case"UPDATE_ACTIVE_GAME":return Object(O.a)(Object(O.a)({},e),{},{activeGame:t.payload});default:return e}},R={loggedIn:!1,socket:null,jitsiRoom:null},U=function(e){return{type:c.LOGIN_REQUEST,payload:e}},w=function(e){return{type:c.LOGIN_SUCCESS,payload:e}},G=function(e){return{type:c.SET_JITSI_ROOM,payload:e}},k=function(e){return{type:c.SET_SOCKET,payload:e}},L=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:R,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case c.LOGIN_REQUEST:return Object(O.a)(Object(O.a)({},e),{},{username:t.payload,loggedIn:!1});case c.LOGIN_SUCCESS:return Object(O.a)(Object(O.a)({},t.payload),{},{loggedIn:!0,jitsiToken:null,socket:null,jitsiRoom:null});case c.LOGIN_FAILURE:case c.LOGOUT:return{loggedIn:!1,socket:null,jitsiRoom:null};case c.SET_JITSI_TOKEN:return Object(O.a)(Object(O.a)({},e),{},{jitsiToken:t.payload});case c.SET_JITSI_ROOM:return Object(O.a)(Object(O.a)({},e),{},{jitsiRoom:t.payload});case c.SET_SOCKET:return Object(O.a)(Object(O.a)({},e),{},{socket:t.payload});default:return e}},D={allChannels:[],loading:!1},M=function(e){return{type:c.INIT_CHANNELS_SUCCESS,payload:e}},x=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:D,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case c.INIT_CHANNELS_REQUEST:return Object(O.a)(Object(O.a)({},e),{},{loading:!0});case c.INIT_CHANNELS_SUCCESS:return{allChannels:t.payload,loading:!1};case c.INIT_CHANNELS_FAILURE:return Object(O.a)(Object(O.a)({},e),{},{loading:!1});default:return e}},P=Object(p.combineReducers)({games:C,user:L,channels:x}),H=a(141),F=Object(p.createStore)(P,Object(H.composeWithDevTools)(Object(p.applyMiddleware)(f.a))),B=a(19),K=a(29),J=a(292),Q=a(289),Y=a(279),z=a(281),V=a(293),W=a(276),Z=a(298),X=Object(W.a)((function(e){return Object(Z.a)({container:{padding:e.spacing(2),textAlign:"center"},linkContainer:{marginTop:e.spacing(2)}})})),q=function(){var e=X(),t=Object(d.d)((function(e){return e.channels.allChannels}),d.b);return s.a.createElement("div",{className:e.container},s.a.createElement("div",null,s.a.createElement(z.a,{variant:"h3"},"Kanavat:")),t.map((function(t){return s.a.createElement("div",{key:t.username,className:e.linkContainer},s.a.createElement(Y.a,{component:K.b,to:"/".concat(t.username),variant:"outlined"},t.channelName))})))},$=function(e){var t=e.user,a=Object(d.c)(),n=Object(B.f)();return t&&t.loggedIn?u.createElement(Y.a,{color:"inherit",onClick:function(){a((window.localStorage.removeItem("kotipelitUser"),{type:c.LOGOUT})),n.push("/")}},u.createElement(z.a,null,"Kirjaa ulos ".concat(t.username))):u.createElement(Y.a,{color:"inherit",onClick:function(){var e,t;a((e="username",t="password",function(){var a=Object(S.a)(g.a.mark((function a(n){var r,o;return g.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n(U(e)),a.prev=1,a.next=4,b.login(e,t);case 4:r=a.sent,b.setToken(r.token),o=Object(O.a)({},r),window.localStorage.setItem("kotipelitUser",JSON.stringify(o)),n(w(o)),a.next=14;break;case 11:a.prev=11,a.t0=a.catch(1),n({type:c.LOGIN_FAILURE});case 14:case"end":return a.stop()}}),a,null,[[1,11]])})));return function(e){return a.apply(this,arguments)}}()))}},u.createElement(z.a,null,"Kirjaudu"))},ee=a(238),te=a(291),ae=a(23),ne=a(150),re=a(151),ce=a(32),oe=a(284),ie=a(285),le=a(286),ue=a(287),se=a(288),Ee=a(240),me=a(283),de=a(237),pe=a(300),fe=a(290),ve=a(297),ge=a(294),Se=a(147),Oe=a.n(Se),Ae=a(108),Te=["DIABOLATRY","FURIOUS","ARCH","DRUGSTORE","DONATION","HORROR","SICK","CARIBOU","BLIP","SNAIL","AIRPORT","MILKY","THINGS","PRAGMATIC","NASTY","CURVED","LIBERATING","BELT","GRIZZLY","BIGMOUTH","HOROSCOPE","LIME","HIGHWAY","THINGS","MACHINE","AGGRESSION","BARBWIRE","PROPELLER","BLEEP","DEDUCTION"],Ie=function(){return Te[Math.floor(Math.random()*Te.length)]},be=function(){for(var e=[],t=[],a=1;a<=5;a++){for(var n=[];n.length<3;){var r=Ie();t.includes(r)||(n.push(r),t.push(r))}e.push({id:Object(ve.a)(),name:"Pelaaja ".concat(a),words:n,points:0,online:!1})}return e},_e=function(e,t,a){var r=function(t,a){var n=e.values.players.map((function(e){if(e.name===t.name){var n=e.words;return n[a]=Ie(),Object(O.a)(Object(O.a)({},e),{},{words:n})}return e}));e.setValues(Object(O.a)(Object(O.a)({},e.values),{},{players:n}))};return s.a.createElement(ce.c,null,s.a.createElement("div",{className:t.gameInfo},s.a.createElement(me.a,{row:!0,className:t.formRow},s.a.createElement(z.a,{className:t.marginRight,component:"label",variant:"h6",htmlFor:"startTime"},"Alkamisaika:"),s.a.createElement(ce.a,{component:ge.a,autoOk:!0,ampm:!1,format:"d. MMMM HH:mm",disablePast:!0,name:"startTime",value:e.values.startTime,onChange:function(t){return e.setFieldValue("startTime",t)}})),s.a.createElement(me.a,{row:!0,className:t.formRow},s.a.createElement(z.a,{className:t.marginRight,component:"label",variant:"h6",htmlFor:"type"},"Pelin tyyppi:"),s.a.createElement(de.a,{variant:"outlined"},s.a.createElement(ce.a,{component:Ae.a,name:"type",disabled:!0},s.a.createElement(pe.a,{value:n.SANAKIERTO},"Sanakierto"))))),s.a.createElement("div",{className:t.gameInfo},s.a.createElement(z.a,{className:t.marginRight,component:"label",variant:"h6",htmlFor:"players"},"Pelaajat:")),s.a.createElement(ce.b,{name:"players",render:function(t){return function(e,t){return s.a.createElement(oe.a,null,s.a.createElement(ie.a,null,s.a.createElement(le.a,null,s.a.createElement(ue.a,null,"Nimi"),s.a.createElement(ue.a,null,"Sana 1"),s.a.createElement(ue.a,null,"Sana 2"),s.a.createElement(ue.a,null,"Sana 3"))),s.a.createElement(se.a,null,e.map((function(e,a){return s.a.createElement(le.a,{key:a},s.a.createElement(ue.a,null,s.a.createElement(ce.a,{component:Ae.b,name:"players.".concat(a,".name")})),e.words.map((function(a,n){return s.a.createElement(ue.a,{key:"".concat(a).concat(n),style:{minWidth:190}},s.a.createElement("span",null,a," "),s.a.createElement(Ee.a,{size:"small",onClick:function(){return t(e,n)}},s.a.createElement(Oe.a,null)))})))}))))}(e.values.players,r)}}),s.a.createElement("div",{className:t.buttonRow},s.a.createElement(fe.a,{variant:"extended",color:"primary",className:t.marginRight,type:"submit"},"Luo peli"),s.a.createElement(fe.a,{variant:"extended",color:"secondary",onClick:a},"Peruuta")))},je=Object(W.a)((function(e){return Object(Z.a)({formRow:{alignItems:"center",marginRight:e.spacing(2)},marginRight:{marginRight:e.spacing(2)},gameInfo:{display:"flex",marginTop:e.spacing(2),marginBottom:e.spacing(2)},buttonRow:{marginTop:e.spacing(2)},wordCell:{minWidth:190}})})),he=function(){var e=je(),t=Object(d.c)(),a=Object(B.f)(),o=function(){a.goBack()};return s.a.createElement("div",null,s.a.createElement(z.a,{variant:"overline",gutterBottom:!0},"Luo uusi peli"),s.a.createElement(te.a,null),s.a.createElement(ae.a,{utils:ne.a,locale:re.a},s.a.createElement(ce.d,{initialValues:{startTime:new Date,type:n.SANAKIERTO,players:be(),status:r.UPCOMING,rounds:3},onSubmit:function(e,a){var n;console.log("values",e,"actions",a),console.log("adding new game"),t((n=e,function(){var e=Object(S.a)(g.a.mark((function e(t){var a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t({type:c.ADD_GAME_REQUEST}),e.prev=1,e.next=4,_.addNew(n);case 4:a=e.sent,t((r=a,{type:c.ADD_GAME_SUCCESS,payload:r})),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),t({type:c.ADD_GAME_FAILURE});case 11:case"end":return e.stop()}var r}),e,null,[[1,8]])})));return function(t){return e.apply(this,arguments)}}())),o()}},(function(t){return _e(t,e,o)}))))},Ne=a(15),ye=a(106),Ce=a.n(ye),Re=function(){return{event:o.JOIN_GAME,data:null}},Ue=function(e){var t;Object(Ne.a)("recieved ".concat(i.CREATE_SUCCESS,", data:")),Object(Ne.a)(e),F.dispatch(G(e.jitsiRoom)),F.dispatch(y(e.game)),F.dispatch((t=e.jitsiToken,{type:c.SET_JITSI_TOKEN,payload:t}))},we=function(e,t){e.on(l.PLAYER_JOINED,(function(e){return function(e){Object(Ne.a)("recieved ".concat(l.PLAYER_JOINED));var t=F.getState().games.activeGame;if(!t)throw new Error("Player joined but no active game is set");var a=t.players.map((function(t){return t.id===e?Object(O.a)(Object(O.a)({},t),{},{online:!0}):t}));F.dispatch(y(Object(O.a)(Object(O.a)({},t),{},{players:a})))}(e)})),t?(e.on(i.CREATE_SUCCESS,(function(e){return Ue(e)})),e.on(i.CREATE_FAILURE,(function(e){return function(e){return Object(Ne.a)("recieved ".concat(i.CREATE_FAILURE,": ").concat(e.error))}(e)})),e.on(i.START_SUCCESS,(function(e){var t;t=e,Object(Ne.a)("recieved ".concat(i.START_SUCCESS,":")),Object(Ne.a)(t),F.dispatch(y(t))})),e.on(i.START_FAILURE,(function(e){return function(e){return Object(Ne.a)("recieved ".concat(i.START_FAILURE,": ").concat(e.error))}(e)})),e.on(i.UPDATE_SUCCESS,(function(e){return function(e){Object(Ne.a)("recieved ".concat(i.UPDATE_SUCCESS,", data:")),Object(Ne.a)(e),F.dispatch(y(e))}(e)})),e.on(i.UPDATE_FAILURE,(function(e){return function(e){return Object(Ne.a)("recieved ".concat(i.UPDATE_FAILURE,": ").concat(e.error))}(e)}))):(e.on(o.JOIN_SUCCESS,(function(e){return function(e){Object(Ne.a)("recieved ".concat(o.JOIN_SUCCESS,":")),Object(Ne.a)(e),F.dispatch(G(e.jitsiRoom)),F.dispatch(y(e.game))}(e)})),e.on(o.JOIN_FAILURE,(function(e){return function(e){return Object(Ne.a)("recieved ".concat(o.JOIN_FAILURE,": ").concat(e.error))}(e)})),e.on(o.GAME_READY,(function(e){return function(e){Object(Ne.a)("recieved ".concat(o.GAME_READY)),F.dispatch(G(e)),console.log("jitsi room t\xe4ss\xe4 turha");try{var t=F.getState().user.socket;if(!t)throw new Error("No socket set for user");Ge(t,Re())}catch(a){console.error(a.message)}}(e)})),e.on(o.GAME_STARTING,(function(e){return function(e){Object(Ne.a)("recieved ".concat(o.GAME_STARTING,":")),Object(Ne.a)(e),F.dispatch(y(e))}(e)})),e.on(o.GAME_UPDATED,(function(e){return function(e){Object(Ne.a)("recieved ".concat(o.GAME_UPDATED,":")),Object(Ne.a)(e),F.dispatch(y(e))}(e)})))},Ge=function(e,t){var a=t.event,n=t.data;Object(Ne.a)("Emitting ".concat(a)),n&&(Object(Ne.a)("Data:"),Object(Ne.a)(n)),e.emit(a,n)},ke=function(){var e=Object(S.a)(g.a.mark((function e(t,a){var n;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("/api/games/".concat(t,"?pelaaja=").concat(a));case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),Le=function(e,t,a){return e.on(l.CONNECT,function(e,t,a){return function(){e.emit(l.AUTH_REQUEST,{token:t}).on(l.AUTHENTICATED,(function(){Object(Ne.a)("socketio authorized"),a(e)})).on(l.UNAUTHORIZED,(function(e){throw Object(Ne.a)("socketio unauthorized"),new Error(e.message)}))}}(e,t,a)),e},De=function(){var e=Object(S.a)(g.a.mark((function e(t,a){var n,r;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a){e.next=2;break}throw new Error("Pelaajan id puuttuu");case 2:return e.next=4,ke(t,a);case 4:return n=e.sent,r=function(e){we(e,!1),Ge(e,Re())},e.abrupt("return",Le(Ce()(),n,r));case 7:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),Me={getTokenForSocket:ke,authenticateSocket:Le,initHostSocket:function(e,t){if(!t)throw new Error("Must provide game ID");return Le(Ce()(),e.token,(function(e){we(e,!0),Ge(e,function(e){return{event:i.CREATE_ROOM,data:e}}(t))}))},initPlayerSocket:De},xe=function(e,t){try{var a=F.getState().user.socket;if(!a)throw new Error("Socket not set for user");Ge(a,function(e,t){return{event:i.JITSI_READY,data:{gameId:e,jitsiRoom:t}}}(e,t))}catch(n){console.error(n.message)}},Pe=function(e){try{var t=F.getState().user.socket;if(!t)throw new Error("Socket not set for user");Ge(t,function(e){return{event:i.START_GAME,data:e}}(e))}catch(a){console.error(a.message)}},He=function(e){try{var t=F.getState().user.socket;if(!t)throw new Error("Socket not set for user");Ge(t,function(e){return{event:i.UPDATE_GAME,data:e}}(e))}catch(a){console.error(a.message)}},Fe=a(42),Be=a(152),Ke=a(296),Je=Object(W.a)((function(e){return Object(Z.a)({container:{marginTop:e.spacing(2)},noPaddingX:{paddingLeft:0,paddingRight:0},saveBtnContainer:{textAlign:"center",marginTop:e.spacing(2)},additionBox:{minWidth:50}})})),Qe=function(e){var t=e.players,a=e.turn,n=e.handleUpdate,r=Je(),c=s.a.useState(new Array(t.length).fill(!1)),o=Object(Fe.a)(c,2),i=o[0],l=o[1],u=function(e){var n=t.length,r=i.reduce((function(e,t){return t?e+1:e}),0);switch(r){case n-1:case 0:return e===a?-50:0;case 1:return i[e]||e===a?100:0;case 2:return i[e]||e===a?30:0;case 3:return i[e]||e===a?10:0}return r};return s.a.createElement("div",{className:r.container},s.a.createElement(oe.a,null,s.a.createElement(se.a,null,s.a.createElement(le.a,null,s.a.createElement(ue.a,{padding:"none",align:"center"},s.a.createElement(z.a,{variant:"overline"},"Pelaaja")),s.a.createElement(ue.a,{padding:"none",align:"center"},s.a.createElement(z.a,{variant:"overline"},"Pisteet")),s.a.createElement(ue.a,{padding:"none",align:"center"},s.a.createElement(z.a,{variant:"overline"},"+ / -")),s.a.createElement(ue.a,{padding:"none",align:"center"},s.a.createElement(z.a,{variant:"overline",noWrap:!0},"Vastaus oikein"))),t.map((function(e,t){return s.a.createElement(le.a,{key:t},s.a.createElement(ue.a,{className:r.noPaddingX,align:"center"},s.a.createElement("span",null,e.name),e.online?null:s.a.createElement(z.a,{variant:"caption",color:"error"}," (offline)")),s.a.createElement(ue.a,{align:"center"},e.points),s.a.createElement(ue.a,{align:"center",className:"".concat(r.noPaddingX," ").concat(r.additionBox)},function(e){var t=e>0?"+".concat(e):"".concat(e),a="";return e>0&&(a="green"),e<0&&(a="red"),s.a.createElement("span",{style:{color:a}},t)}(u(t))),s.a.createElement(ue.a,{align:"center",padding:"checkbox"},t===a?s.a.createElement(z.a,{variant:"caption",color:"textSecondary"},"Kysyj\xe4"):s.a.createElement(Ke.a,{value:i[t],checked:i[t],onChange:function(){var e=Object(Be.a)(i);e[t]=!e[t],l(e)}})))})))),s.a.createElement("div",{className:r.saveBtnContainer},s.a.createElement(fe.a,{variant:"extended",color:"primary",onClick:function(){var e=t.map((function(e,t){return Object(O.a)(Object(O.a)({},e),{},{points:e.points+u(t)})}));l(new Array(t.length).fill(!1)),n(e)}},"P\xe4ivit\xe4 pisteet")))},Ye=function(e,t){var a=s.a.useRef();s.a.useEffect((function(){a.current=e}),[e]),s.a.useEffect((function(){if(null!==t){var e=setInterval((function(){if(!a||!a.current)throw new Error("Problem with interval hook");a.current()}),t);return function(){return clearInterval(e)}}}),[t])},ze=Object(W.a)((function(e){return Object(Z.a)({container:{padding:e.spacing(1)},flex:{display:"flex",alignItems:"center"},grow:{flexGrow:1}})})),Ve=function(e){var t=e.game,a=ze(),n=Object(d.d)((function(e){return e.user.socket})),c=s.a.useState(!1),o=Object(Fe.a)(c,2),i=o[0],l=o[1],u=s.a.useState(90),E=Object(Fe.a)(u,2),m=E[0],p=E[1];if(Ye((function(){p(m-1),1===m&&l(!1)}),i?1e3:null),!n)return s.a.createElement(z.a,null,"Yhdistet\xe4\xe4n...");var f=t.players,v=t.info,g=f.findIndex((function(e){return e.id===v.turn}));if(g<0)throw new Error("Something went wrong with player turns");var S=f[g];return s.a.createElement("div",{className:a.container},s.a.createElement(z.a,{variant:"h6"},"Kierros ".concat(t.info.round)),s.a.createElement("div",{className:a.flex},s.a.createElement("div",{className:a.grow},s.a.createElement(z.a,{variant:"overline",component:"div",className:a.grow},"Vuorossa:"),s.a.createElement(z.a,{component:"div",gutterBottom:!0},S.name)),s.a.createElement("div",{className:a.grow},s.a.createElement(z.a,{variant:"overline",component:"div",className:a.grow},"Sanat:"),s.a.createElement(z.a,{component:"div",gutterBottom:!0},S.words.join(" / ")))),s.a.createElement("div",null,s.a.createElement(z.a,{variant:"overline",component:"div"},"Vastausaika:"),s.a.createElement("div",{className:a.flex},s.a.createElement(z.a,{component:"div",className:a.grow},0!==m?"".concat(m," sekuntia"):s.a.createElement(z.a,{color:"textSecondary"},"Aika loppui")),s.a.createElement("div",{className:a.grow},s.a.createElement(fe.a,{variant:"extended",size:"small",color:"secondary",onClick:function(){0!==m&&l(!i)},disabled:0===m},i?"Pys\xe4yt\xe4":"K\xe4ynnist\xe4")))),s.a.createElement(Qe,{players:t.players,turn:t.players.indexOf(S),handleUpdate:function(e){var a,n;g===e.length-1?(a=t.info.round+1,n=e[0].id):(a=t.info.round,n=e[g+1].id);var c=Object(O.a)(Object(O.a)({},t),{},{players:e,info:{round:a,turn:n},status:a>t.rounds?r.FINISHED:r.RUNNING});He(c),i&&l(!1),p(90)}}))},We=Object(W.a)((function(e){return Object(Z.a)({container:{padding:e.spacing(2)},header:{marginLeft:e.spacing(2)}})})),Ze=function(e){var t=e.results,a=We();return s.a.createElement("div",{className:a.container},s.a.createElement(z.a,{variant:"h4",gutterBottom:!0,className:a.header},"PELI P\xc4\xc4TTYI"),s.a.createElement(oe.a,null,s.a.createElement(se.a,null,t.map((function(e,a){var n=s.a.createElement(le.a,{key:e.name},s.a.createElement(ue.a,null,e.name),s.a.createElement(ue.a,null,"".concat(e.points," pistett\xe4")));return a<t.length-1&&t[a+1].points<e.points&&1,n})))))},Xe=function(e){var t=e.players;return s.a.createElement(oe.a,null,s.a.createElement(se.a,null,s.a.createElement(le.a,null,s.a.createElement(ue.a,null,s.a.createElement(z.a,{variant:"overline"},"Pelaaja")),s.a.createElement(ue.a,{align:"center"},s.a.createElement(z.a,{variant:"overline"},"Pisteet"))),t.map((function(e){return s.a.createElement(le.a,{key:e.id},s.a.createElement(ue.a,null,e.name),s.a.createElement(ue.a,{align:"center"},e.points))}))))},qe=Object(W.a)((function(e){return Object(Z.a)({container:{padding:e.spacing(2)}})})),$e=function(e){var t=e.game,a=qe(),n=t.players,r=t.info,c=n.findIndex((function(e){return e.id===r.turn}));if(c<0)throw new Error("Something went wrong with player turns");var o=n[c];return s.a.createElement("div",null,s.a.createElement("div",{className:a.container},s.a.createElement(z.a,{variant:"h6"},"Kierros ".concat(t.info.round)),s.a.createElement(z.a,{variant:"overline",component:"div"},"Vuorossa:"),s.a.createElement(z.a,{component:"div",gutterBottom:!0},o.name)),s.a.createElement(Xe,{players:t.players}))},et=a(148),tt=Object(W.a)((function(e){return Object(Z.a)({btnContainer:{textAlign:"center",marginTop:e.spacing(2)}})})),at=function(e){var t=e.token,a=e.roomName,n=e.handleLoaded,r=e.dev,c=s.a.useState(!r),o=Object(Fe.a)(c,2),i=o[0],l=o[1],u=tt();return i?s.a.createElement(et.a,{roomName:a,domain:"meet.kotipelit.com",jwt:t||void 0,onAPILoad:n}):s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:u.btnContainer},s.a.createElement(fe.a,{variant:"extended",onClick:function(){return l(!0)}},"K\xe4ynnist\xe4 video")),t&&s.a.createElement("div",{className:u.btnContainer},s.a.createElement(fe.a,{variant:"extended",onClick:n},"Trigger API loaded")))},nt=Object(W.a)((function(e){return Object(Z.a)({startBtn:{textAlign:"center",margin:e.spacing(2)}})})),rt=function(e){var t=e.game,a=e.handleStart,n=nt();return s.a.createElement("div",null,a&&s.a.createElement("div",{className:n.startBtn},s.a.createElement(fe.a,{variant:"extended",onClick:a},"Aloita peli")),s.a.createElement(oe.a,null,s.a.createElement(se.a,null,t.players.map((function(e){return s.a.createElement(le.a,{key:e.id},s.a.createElement(ue.a,null,e.name),s.a.createElement(ue.a,null,e.online?s.a.createElement(z.a,{variant:"caption",color:"primary"},"Paikalla"):s.a.createElement(z.a,{variant:"caption",color:"textSecondary"},"Odotetaan...")))})))))},ct=Object(W.a)((function(e){return Object(Z.a)({container:{display:"flex"},jitsiContainer:{boxSizing:"border-box",width:"65%",backgroundColor:e.palette.grey[400]},hostControls:{boxSizing:"border-box",width:"35%",padding:e.spacing(2),marginLeft:e.spacing(1)}})})),ot=function(){var e=ct(),t=Object(d.d)((function(e){return e.games.activeGame})),a=Object(B.h)().gameID,n=Object(d.d)((function(e){return e.user}),d.b),c=Object(d.d)((function(e){return e.user.socket})),o=Object(d.d)((function(e){return e.user.jitsiRoom})),i=Object(B.g)(),l=Object(d.c)();s.a.useEffect((function(){c||(Object(Ne.a)("initializing socket"),n.loggedIn?l(k(Me.initHostSocket(n,a))):Me.initPlayerSocket(a,function(e){return new URLSearchParams(e.search).get("pelaaja")}(i)).then((function(e){return l(k(e))})).catch((function(e){return console.error(e.message)})))}),[]);return s.a.createElement("div",{className:e.container},s.a.createElement(ee.a,{elevation:5,className:e.jitsiContainer},a&&o?s.a.createElement(at,{token:n.loggedIn?n.jitsiToken:null,roomName:o,handleLoaded:function(){return function(e,t){xe(e,t)}(a,o)},dev:!0}):n.loggedIn?s.a.createElement(z.a,null,"Ladataan..."):s.a.createElement(z.a,null,"Odotetaan, ett\xe4 host k\xe4ynnist\xe4\xe4 pelin...")),s.a.createElement(ee.a,{elevation:5,className:e.hostControls},function(){return c&&t?t.status===r.WAITING?s.a.createElement(rt,{game:t,handleStart:n.loggedIn?function(){Pe(a)}:null}):t.status===r.RUNNING?n.loggedIn?s.a.createElement(Ve,{game:t}):s.a.createElement($e,{game:t}):s.a.createElement(Ze,{results:(e=t.players,e.sort((function(e,t){return t.points-e.points})))}):s.a.createElement(z.a,null,"Yhdistet\xe4\xe4n...");var e}()))},it=a(107),lt=a(153),ut=a(149),st=a.n(ut),Et=Object(W.a)((function(e){return Object(Z.a)({container:{marginTop:e.spacing(1),padding:e.spacing(2)},infoBar:{alignItems:"center"},flex:{display:"flex",justifyContent:"space-between"},editButton:{marginLeft:e.spacing(1)},playerRow:{},inviteText:{marginTop:e.spacing(1),marginBottom:e.spacing(1)}})})),mt=function(e,t,a){return"Tervetuloa pelaamaan ".concat(Object(it.capitalize)(e.type),"a!\n  \nSanasi ovat: ").concat(a?a.words.join(" "):"<Pelaajan sanat>","\n      \nTeht\xe4v\xe4n\xe4si on mietti\xe4 sanoille niit\xe4 kuvaavat vihjeet.\n      \nPeli alkaa ").concat(new Date(e.startTime).toUTCString(),"\n      \nN\xe4hd\xe4\xe4n peleill\xe4 osoitteessa:\n").concat(a?function(e,t,a){return"https://www.kotipelit.com".concat(t,"/").concat(e,"?pelaaja=").concat(a)}(e.id,t,null===a||void 0===a?void 0:a.id):"<Pelaajan linkki>")},dt=function(e){var t=e.game,a=Et(),n=Object(B.g)().pathname,r=s.a.useState(null),o=Object(Fe.a)(r,2),i=o[0],l=o[1],u=s.a.useState(mt(t,n)),E=Object(Fe.a)(u,2),m=E[0],p=E[1],f=Object(d.c)(),v=Object(B.f)();return s.a.createElement(ee.a,{elevation:2,className:a.container},s.a.createElement("div",{className:"".concat(a.infoBar," ").concat(a.flex)},s.a.createElement("div",null,s.a.createElement(z.a,null,new Date(t.startTime).toUTCString())),s.a.createElement("div",null,s.a.createElement(z.a,null,Object(it.capitalize)(t.type))),s.a.createElement("div",null,s.a.createElement(z.a,null,"".concat(t.players.length," pelaajaa"))),s.a.createElement("div",null,s.a.createElement(Y.a,{variant:"contained",color:"secondary",onClick:function(){var e;console.log("HISRY:",v,"PATH",n),f((e=t.id,{type:c.LAUNCH_GAME,payload:e})),v.push("/".concat(n,"/").concat(t.id))}},"K\xe4ynnist\xe4"),s.a.createElement(Ee.a,{size:"small",className:a.editButton,onClick:function(e){l(e.currentTarget)}},s.a.createElement(st.a,null)),s.a.createElement(lt.a,{anchorEl:i,open:Boolean(i),onClose:function(){return l(null)},getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"}},s.a.createElement(pe.a,null,s.a.createElement(z.a,null,"Muokkaa")),s.a.createElement(pe.a,{onClick:function(){var e;window.confirm("Poistetaanko peli?")&&f((e=t.id,function(){var t=Object(S.a)(g.a.mark((function t(a){return g.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a({type:c.DELETE_GAME_REQUEST}),t.prev=1,t.next=4,_.deleteGame(e);case 4:a((n=e,{type:c.DELETE_GAME_SUCCESS,payload:n})),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(1),a({type:c.DELETE_GAME_FAILURE});case 10:case"end":return t.stop()}var n}),t,null,[[1,7]])})));return function(e){return t.apply(this,arguments)}}()))}},s.a.createElement(z.a,{color:"secondary"},"Poista"))))),s.a.createElement("div",null,s.a.createElement(z.a,{variant:"h6",gutterBottom:!0},"Pelaajat"),t.players.map((function(e){return s.a.createElement("div",{key:e.id,className:"".concat(a.flex," ").concat(a.playerRow)},s.a.createElement(z.a,{component:"div"},e.name),s.a.createElement(z.a,{component:"div"},e.words.join(" / ")),s.a.createElement("div",null,s.a.createElement(Y.a,{variant:"outlined",color:"primary",onClick:function(){return function(e,t,a){console.log("TODO: copy to clipboard?"),p(mt(e,t,a))}(t,n,e)}},"N\xe4yt\xe4 kutsuteksti")))}))),s.a.createElement("div",{className:a.inviteText},s.a.createElement(z.a,{variant:"h6",gutterBottom:!0},"Kutsuteksti"),s.a.createElement(z.a,{style:{whiteSpace:"pre"}},m)))},pt=Object(W.a)((function(e){return Object(Z.a)({marginTop:{marginTop:e.spacing(2)}})})),ft=function(e){var t=e.user,a=pt(),n=Object(d.d)((function(e){return e.games.allGames}));return s.a.createElement("div",null,s.a.createElement("div",null,s.a.createElement(z.a,{variant:"overline"},"Tulevat pelit:")),s.a.createElement("div",null,n&&n.map((function(e){return s.a.createElement(dt,{key:e.id,game:e})}))),s.a.createElement("div",{className:a.marginTop},s.a.createElement(fe.a,{color:"primary",variant:"extended",component:K.b,to:"/".concat(t.username,"/newgame")},"LUO PELI")))},vt=Object(W.a)((function(e){return Object(Z.a)({marginBottom:{marginBottom:e.spacing(2)},container:{padding:e.spacing(3)}})})),gt=function(e){var t=e.labelText,a=vt(),n=Object(d.c)();s.a.useEffect((function(){n(function(){var e=Object(S.a)(g.a.mark((function e(t){var a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t({type:c.INIT_GAMES_REQUEST}),e.prev=1,e.next=4,_.getAll();case 4:a=e.sent,t(N(a)),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),t({type:c.INIT_GAMES_FAILURE});case 11:case"end":return e.stop()}}),e,null,[[1,8]])})));return function(t){return e.apply(this,arguments)}}())}),[n]);var r,o=Object(d.d)((function(e){return e.user})),i=(r=o)&&r.loggedIn?r:null;return s.a.createElement(K.a,null,s.a.createElement(ee.a,{elevation:5,className:a.container},s.a.createElement(z.a,{variant:"h3",gutterBottom:!0},t),s.a.createElement(te.a,{className:a.marginBottom}),s.a.createElement(B.c,null,s.a.createElement(B.a,{path:"/:username/newgame"},i?s.a.createElement(he,null):null),s.a.createElement(B.a,{path:"/:username/:gameID"},s.a.createElement(ot,null)),s.a.createElement(B.a,{path:"/"},i?s.a.createElement(ft,{user:i}):null))))},St=Object(W.a)((function(e){return Object(Z.a)({navbar:{marginBottom:e.spacing(3)},toolbar:{display:"flex",justifyContent:"space-between"}})})),Ot=function(){var e=St(),t=Object(d.c)(),a=Object(d.d)((function(e){return e.user}),d.b),n=Object(d.d)((function(e){return e.channels.allChannels}),d.b);s.a.useEffect((function(){t((function(e){var t=window.localStorage.getItem("kotipelitUser");if(t){var a=JSON.parse(t);b.setToken(a.token),e({type:c.LOGIN_SUCCESS,payload:a})}})),t(function(){var e=Object(S.a)(g.a.mark((function e(t){var a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t({type:c.INIT_CHANNELS_REQUEST}),e.prev=1,e.next=4,b.getAll();case 4:a=e.sent,t(M(a)),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),t({type:c.INIT_CHANNELS_FAILURE});case 11:case"end":return e.stop()}}),e,null,[[1,8]])})));return function(t){return e.apply(this,arguments)}}())}),[t]);return s.a.createElement(K.a,null,s.a.createElement(J.a,{position:"static",className:e.navbar},s.a.createElement(Q.a,{className:e.toolbar},s.a.createElement(Y.a,{color:"inherit",component:K.b,to:"/"},s.a.createElement(z.a,{variant:"h6"},"Kotipelit.com")),s.a.createElement($,{user:a}))),s.a.createElement(V.a,null,s.a.createElement(B.c,null,function(e){return e.map((function(e){return s.a.createElement(B.a,{key:e.username,path:"/".concat(e.username)},s.a.createElement(gt,{labelText:e.channelName}))}))}(n),s.a.createElement(B.a,{path:"/"},s.a.createElement(q,null)))))};m.a.render(s.a.createElement(d.a,{store:F},s.a.createElement(Ot,null)),document.getElementById("root"))}},[[172,1,2]]]);
//# sourceMappingURL=main.2b93fa70.chunk.js.map