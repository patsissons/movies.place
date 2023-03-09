<script lang="ts">
  import { page } from '$app/stores'

  const tabNames = ['grid', 'table'] as const
  type TabName = (typeof tabNames)[number]

  $: active = loadTabFromHash($page.url.hash)

  function loadTabFromHash(hash = ''): TabName {
    const name = hash.replace(/^#/, '') as TabName
    if (tabNames.includes(name)) return name

    return 'grid'
  }
</script>

<div class="tabs flex justify-center p-4">
  <a class="tab tab-bordered" class:tab-active={active === 'grid'} href="#grid">
    Grid
  </a>
  <a
    class="tab tab-bordered"
    class:tab-active={active === 'table'}
    href="#table"
  >
    Table
  </a>
</div>
{#if active === 'grid'}
  <slot name="grid" />
{/if}
{#if active === 'table'}
  <slot name="table" />
{/if}
