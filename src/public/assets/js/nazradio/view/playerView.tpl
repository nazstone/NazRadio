<div class="wrap_progress" style="height:50px; width: 100%;">
	<div class="global_right_margin wrap_right" style="margin-right:6px;">
		<button type="button" class="btn btn-default" id="control-backward" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-step-backward"></span>
		</button>
		<button type="button" class="btn btn-default" id="control-stop" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-stop"></span>
		</button>
		<button type="button" class="btn btn-default"  id="control-play" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-<%if (play) {%>pause<%} else {%>play<%}%>"></span>
		</button>
		<button type="button" class="btn btn-default"  id="control-forward" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-step-forward"></span>
		</button>
	</div>
    <h4 class="global_left_margin wrap_title" style="padding-top: 6px;height:inherit;"><%if (artist != null && artist.length > 0) {%><%=artist%><%} else {%><%=radio%></%><%}%></h4>
</div>
<div class="progressBar global_right_margin global_left_margin">
    <div class="bar" style="width: <%=pct%>%"></div>
    <span class="progressText">
        <div class="wrap_right wrap_time_player" id="playing_ellapse_time"><%=ellapsed_time%> / <%=total_time%></div>
        <div class="wrap_title" id="playing_title"><b><%=title%></b>
            <%if (title != null && title.length > 0) {%> - <%}%><%=album%>
        </div>
    </span>
</div>