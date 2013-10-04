<%

var months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

%>

<div class="media list-group-item" style="display:none">
	<a href="<%= user.url %>" class="pull-left">
	  <img src="<%= user.profile_image_url %>" class="media-object" />
	</a>
	<div class="media-body">
		<p class="pull-right text-muted">
			<% var date = (new Date(created_at)); %>
			<%= date.getDate() %><%= months[date.getMonth()] %>
		</p>

	  <h4 class="media-heading"><%= user.name %></h4>
	  <h5 class="media-heading text-muted">@<%= user.screen_name %></h5>
	  <p><%= text %></p>
	</div>
</div>