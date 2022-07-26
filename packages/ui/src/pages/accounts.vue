<route lang="yaml">
name: accounts
meta:
  public: false
  sidebar:
    hidden: false
    icon: Users
    sort: 200
</route>

<template>
  <Entities title="Accounts" icon="Users" :entities="[]" />
</template>