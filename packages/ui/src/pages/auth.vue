<route lang="yaml">
name: auth
meta:
  layout: minimal
  public: true
  sidebar:
    hidden: true
</route>

<script setup lang="ts">
//Refs
const step = ref(0);
const passwordVisible = ref(false);
const totpVisible = ref(false);
const hasAdditionalMethods = ref(false);

//Computed
const schema = computed(() => (step.value == 0 ? {
  username: (value: string) => /^[A-Za-z0-9-_]{3,256}$/.test(value),
  password: (value: string) => /^[ -~]{12,256}$/.test(value)
} : {
  totp: (value: string) => /^[0-9]{6}$/.test(value)
}));

//Validation
const {handleSubmit, meta} = useForm({
  validationSchema: schema
});
const {value: username, errorMessage: usernameError} = useField('username');
const {value: password, errorMessage: passwordError} = useField('password');
const {value: totp, errorMessage: totpError} = useField('totp');

//Methods
const onSubmit = handleSubmit(values =>
{
  console.log('Submitted', values);
  step.value++;
});
</script>

<template>
  <v-row align="center" class="fill-height" justify="center">
    <v-card :title="$t('routes.auth.title')" prepend-icon="Shield">
      <v-card-text>
        <v-form class="form" @submit="onSubmit">
          <!-- Username -->
          <v-text-field
            v-if="step == 0" v-model="username" :label="$t('routes.auth.form.username')" required
            prepend-icon="User" :error-messages="usernameError"
          />

          <!-- Password -->
          <v-text-field
            v-if="step == 0" v-model="password" :label="$t('routes.auth.form.password')" required
            prepend-icon="Lock" :append-icon="passwordVisible ? 'Eye' : 'EyeOff'"
            :type="passwordVisible ? 'text' : 'password'" :error-messages="passwordError"
            @click:append="passwordVisible = !passwordVisible"
          />

          <!-- TOTP -->
          <v-text-field
            v-if="step == 1" v-model="totp" :label="$t('routes.auth.form.totp')" required
            prepend-icon="Lock" :append-icon="totpVisible ? 'Eye' : 'EyeOff'" :error-messages="totpError"
            :type="totpVisible ? 'text' : 'password'" @click:append="totpVisible = !totpVisible"
          />

          <!-- Submit -->
          <v-btn block color="primary" :disabled="!meta.dirty || !meta.valid" prepend-icon="LogIn" type="submit">
            {{ $t('routes.auth.form.submit') }}
          </v-btn>
        </v-form>

        <!-- Divider -->
        <p v-if="hasAdditionalMethods" class="d-flex my-3 split-divider text-overline">
          {{ $t('routes.auth.form.or') }}
        </p>

        <!-- Additional methods -->
        <plugin-target
          name="auth:additional-methods" class="additional-methods"
          @wormhole-content="hasContent => hasAdditionalMethods = hasContent"
        />
      </v-card-text>
    </v-card>
  </v-row>

  <plugin-portal name="auth:additional-methods">
    <v-btn block color="black" prepend-icon="Github">
      GitHub
    </v-btn>
  </plugin-portal>

  <plugin-portal name="auth:additional-methods">
    <v-btn block color="orange" prepend-icon="Gitlab">
      GitLab
    </v-btn>
  </plugin-portal>
</template>

<style scoped>
.additional-methods > *:not(:last-child) {
  margin-bottom: 12px;
}

.form {
  min-width: 300px;
  width: 40vw;
}

.split-divider {
  align-items: center;
}

.split-divider::before,
.split-divider::after {
  content: '';
  border-bottom: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  flex: 1;
}

.split-divider::before {
  margin-right: 8px;
}

.split-divider::after {
  margin-left: 8px;
}
</style>