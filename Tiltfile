# Step 0: Allow Remote Cluster

allow_k8s_contexts('ticketingCluster')

# Step 1: Deploy

k8s_yaml(
  [
    './infra/k8s/auth-depl.yaml',
    './infra/k8s/auth-mongo-depl.yaml',
    './infra/k8s/client-depl.yaml',
    './infra/k8s/expiration-depl.yaml',
    './infra/k8s/expiration-redis-depl.yaml',
    './infra/k8s/nats-depl.yaml',
    './infra/k8s/orders-depl.yaml',
    './infra/k8s/orders-mongo-depl.yaml',
    './infra/k8s/payments-depl.yaml',
    './infra/k8s/payments-mongo-depl.yaml',
    './infra/k8s/tickets-depl.yaml',
    './infra/k8s/tickets-mongo-depl.yaml'
  ]
)

# Step 2: Build

custom_build(
  'ghcr.io/kchiu-dev/auth',
  'docker buildx build --file "auth/Dockerfile" --tag $EXPECTED_REF \
  --secret id=cr_pat,src=auth/cr_pat.txt --push auth',
  ['./auth'],
  skips_local_docker=True,
  disable_push=True,
  entrypoint='npm start',
  live_update=[
    sync('./auth', '/app'),
    run('cd /app && npm install', trigger=['auth/package.json'])
  ]
)

custom_build(
  'ghcr.io/kchiu-dev/client',
  'docker buildx build --file "client/Dockerfile" --tag $EXPECTED_REF \
  --secret id=cr_pat,src=client/cr_pat.txt --push client',
  ['./client'],
  skips_local_docker=True,
  disable_push=True,
  entrypoint='npm run dev',
  live_update=[
    sync('./client', '/app'),
    run('cd /app && npm install', trigger=['client/package.json'])
  ]
)

custom_build(
  'ghcr.io/kchiu-dev/tickets',
  'docker buildx build --file "tickets/Dockerfile" --tag $EXPECTED_REF \
  --secret id=cr_pat,src=tickets/cr_pat.txt --push tickets',
  ['./tickets'],
  skips_local_docker=True,
  disable_push=True,
  entrypoint='npm start',
  live_update=[
    sync('./tickets', '/app'),
    run('cd /app && npm install', trigger=['tickets/package.json'])
  ]
)

custom_build(
  'ghcr.io/kchiu-dev/orders',
  'docker buildx build --file "orders/Dockerfile" --tag $EXPECTED_REF \
  --secret id=cr_pat,src=orders/cr_pat.txt --push orders',
  ['./orders'],
  skips_local_docker=True,
  disable_push=True,
  entrypoint='npm start',
  live_update=[
    sync('./orders', '/app'),
    run('cd /app && npm install', trigger=['orders/package.json'])
  ]
)

custom_build(
  'ghcr.io/kchiu-dev/expiration',
  'docker buildx build --file "expiration/Dockerfile" --tag $EXPECTED_REF \
  --secret id=cr_pat,src=expiration/cr_pat.txt --push expiration',
  ['./expiration'],
  skips_local_docker=True,
  disable_push=True,
  entrypoint='npm start',
  live_update=[
    sync('./expiration', '/app'),
    run('cd /app && npm install', trigger=['expiration/package.json'])
  ]
)

custom_build(
  'ghcr.io/kchiu-dev/payments',
  'docker buildx build --file "payments/Dockerfile" --tag $EXPECTED_REF \
  --secret id=cr_pat,src=payments/cr_pat.txt --push payments',
  ['./payments'],
  skips_local_docker=True,
  disable_push=True,
  entrypoint='npm start',
  live_update=[
    sync('./payments', '/app'),
    run('cd /app && npm install', trigger=['payments/package.json'])
  ]
)

# Step 3: Watch

k8s_resource('auth-depl', port_forwards=9000)
k8s_resource('client-depl', port_forwards=9001)
k8s_resource('tickets-depl', port_forwards=9002)
k8s_resource('orders-depl', port_forwards=9003)
k8s_resource('expiration-depl', port_forwards=9004)
k8s_resource('payments-depl', port_forwards=9005)