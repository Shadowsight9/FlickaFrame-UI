<template>

  <div class="default-layout h-screen w-full bg-background">
    <AStyleProvider hash-priority="high">

      <LayoutHeader class="col-span-2" />
      <LayoutSidebar class="row-start-2 row-end-3" />
      <div class="col-span-1 row-span-1 overflow-y-scroll">
        <slot />
      </div>

    </AStyleProvider>

  </div>

</template>

<style scoped>
.default-layout {
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  grid-template-rows: 6rem minmax(0, 1fr);
}

</style>
