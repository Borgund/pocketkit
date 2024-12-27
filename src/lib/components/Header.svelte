<script>
	const { user } = $props();
</script>

<header>
	<nav>
		<ul>
			<li><a href="" class="contrast">Link1</a></li>
			<li><a href="" class="contrast">Link2</a></li>
		</ul>
		<ul><li><strong>Random Corp</strong></li></ul>
		{#if user}
			<ul>
				<li>
					<details class="dropdown">
						<summary role="button" class="outline contrast">
							{user.email}
						</summary>
						<ul dir="rtl">
							<form action="/login?/logout" method="post">
								<li>
									<button
										class="outline"
										data-tooltip="Log out of the service"
										data-placement="left"
									>
										Log out
									</button>
								</li>
							</form>
						</ul>
					</details>
				</li>
			</ul>
		{/if}
	</nav>
</header>

<style>
	header {
		background-color: var(--pico-primary-background);
	}
</style>
