# Phase III Load Testing Guide

**Load Testing for Phase III AI-Powered Todo Chatbot**

---

## Overview

Comprehensive load testing suite to verify performance under realistic and stress conditions.

---

## Prerequisites

### Install k6

**macOS**:
```bash
brew install k6
```

**Linux (Ubuntu/Debian)**:
```bash
apt-get install k6
```

**Windows**:
```bash
choco install k6
```

**Docker**:
```bash
docker run -i grafana/k6 run - <script.js
```

### Verify Installation

```bash
k6 version
# Expected: k6 vX.XX.X (...)
```

---

## Load Testing Script

**Location**: `phase-2/backend/tests/load/chat_load_test.js`

**What it Tests**:
- User authentication (signup/signin)
- Conversation creation and listing
- Message sending and receiving
- Conversation deletion
- Error handling and resilience

**Test Stages**:
1. Ramp-up to 20 users (30 seconds)
2. Ramp-up to 50 users (1 minute 30 seconds)
3. Ramp-down to 0 users (20 seconds)

**Total Duration**: ~4 minutes

---

## Running Load Tests

### Prerequisites

Before running load tests, ensure:

```bash
# Backend is running
cd phase-2/backend
uv run uvicorn src.main:app --reload

# Database is ready
# Test user database is initialized
```

### Basic Load Test

```bash
# From phase-2/backend directory
k6 run tests/load/chat_load_test.js
```

### With Custom Configuration

```bash
# Adjust VUs (Virtual Users) and duration
k6 run -e BASE_URL=http://localhost:8000 \
       -e DURATION=2m \
       -e VUS=100 \
       tests/load/chat_load_test.js
```

### Advanced Scenarios

**Light Load** (5 users, 1 minute):
```bash
k6 run -e BASE_URL=http://localhost:8000 \
       --vus 5 \
       --duration 1m \
       tests/load/chat_load_test.js
```

**Medium Load** (50 users, 2 minutes):
```bash
k6 run -e BASE_URL=http://localhost:8000 \
       --vus 50 \
       --duration 2m \
       tests/load/chat_load_test.js
```

**Heavy Load** (200 users, 5 minutes):
```bash
k6 run -e BASE_URL=http://localhost:8000 \
       --vus 200 \
       --duration 5m \
       tests/load/chat_load_test.js
```

**Stress Test** (Ramp to 500 users):
```bash
k6 run --stage 30s:0 \
       --stage 30s:100 \
       --stage 1m:200 \
       --stage 1m:500 \
       --stage 30s:0 \
       tests/load/chat_load_test.js
```

---

## Performance Thresholds

### Expected Metrics

| Metric | Target | Status |
|--------|--------|--------|
| P95 Response Time | < 3000ms | ✅ |
| P99 Response Time | < 5000ms | ✅ |
| Error Rate | < 10% | ✅ |
| Throughput | > 10 req/s | ✅ |

### Threshold Configuration

In `chat_load_test.js`:
```javascript
thresholds: {
  http_req_duration: ["p(95)<3000"],  // 95th percentile < 3 seconds
  http_req_failed: ["rate<0.1"],      // Error rate < 10%
}
```

---

## Interpreting Results

### Example Output

```
scenarios: (100.00%) 1 scenario, 50 max VUs, ~2m30s max duration (incl. think time)
             default: 50.00% VUs, 1m30s ramp-up, 20s ramp-down

 ✓ auth status is 200
 ✓ create conversation status is 200
 ✓ send message status is 200
 ✓ get messages status is 200
 ✗ delete conversation status is 200

 checks................: 95.32% 2381 out of 2500
 data_received........: 654 kB 4.4 kB/s
 data_sent............: 321 kB 2.1 kB/s
 http_req_blocked.....: avg=145µs   min=25µs   med=85µs    max=5.6ms   p(95)=325µs
 http_req_connecting..: avg=0s      min=0s     med=0s      max=0s      p(95)=0s
 http_req_duration....: avg=1.23s   min=15ms   med=1.1s    max=8.2s    p(95)=2.8s
 http_req_failed......: 4.68%   ✓
 http_req_receiving...: avg=15ms    min=1ms    med=5ms     max=150ms   p(95)=45ms
 http_req_sending.....: avg=8ms     min=1ms    med=5ms     max=250ms   p(95)=20ms
 http_req_tls_handshake: avg=0s      min=0s     med=0s      max=0s      p(95)=0s
 http_req_waiting.....: avg=1.2s    min=14ms   med=1.09s   max=8.1s    p(95)=2.75s
 iteration_duration...: avg=11.5s   min=2.1s   med=11.2s   max=41.3s   p(95)=21.5s
 iterations..........: 50      0.333/s
 vus....................: 2      min=0        max=50
 vus_max..............: 50      min=50       max=50
```

### Key Metrics Explained

- **checks**: Pass rate of assertions (should be > 95%)
- **http_req_duration**: Response time statistics
  - **p(95)**: 95th percentile (should be < 3000ms)
  - **max**: Maximum response time
- **http_req_failed**: Percentage of failed requests (should be < 10%)
- **data_received/sent**: Bandwidth usage
- **iterations**: Number of test cycles completed

---

## Performance Optimization Tips

If response times are high:

### Backend Optimization

1. **Database Optimization**
```python
# Ensure indexes are created
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
```

2. **Query Optimization**
- Use `.select()` to fetch only needed columns
- Implement pagination for large result sets
- Cache frequently accessed data

3. **API Optimization**
- Add response caching headers
- Implement database connection pooling
- Optimize OpenAI API calls (batch operations)

4. **Server Optimization**
- Increase worker processes
- Enable gzip compression
- Use production database (Neon vs SQLite)

### Frontend Optimization

1. **Network Optimization**
- Minify JavaScript and CSS
- Enable gzip compression
- Use HTTP/2

2. **API Optimization**
- Implement request debouncing
- Use optimistic updates
- Cache API responses

---

## Load Testing Scenarios

### Scenario 1: Baseline Performance (Recommended Starting Point)

```bash
k6 run --stage 30s:20 \
       --stage 1m:20 \
       --stage 30s:0 \
       tests/load/chat_load_test.js
```

**Expected Results**:
- 20 concurrent users
- 2-3 minutes duration
- Response times: 500-1500ms
- Error rate: < 1%

### Scenario 2: Peak Hour (Maximum Expected Load)

```bash
k6 run --stage 30s:50 \
       --stage 2m:50 \
       --stage 30s:0 \
       tests/load/chat_load_test.js
```

**Expected Results**:
- 50 concurrent users
- 3-4 minutes duration
- Response times: 1500-3000ms
- Error rate: < 5%

### Scenario 3: Stress Test (Beyond Expected Load)

```bash
k6 run --stage 30s:100 \
       --stage 1m:100 \
       --stage 30s:0 \
       tests/load/chat_load_test.js
```

**Expected Results**:
- 100 concurrent users
- 2-3 minutes duration
- Response times: 2000-5000ms
- Error rate: 5-15%

### Scenario 4: Breaking Point

```bash
k6 run --stage 30s:0 \
       --stage 30s:100 \
       --stage 1m:200 \
       --stage 1m:500 \
       --stage 30s:0 \
       tests/load/chat_load_test.js
```

**Expected Results**:
- Identify breaking point
- Find resource bottlenecks
- Determine scaling limits

---

## Continuous Load Testing

### Automated Load Testing (CI/CD Integration)

```yaml
# .github/workflows/load-test.yml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Start backend
        run: |
          cd phase-2/backend
          uv run uvicorn src.main:app &
          sleep 5
      - name: Run k6 load test
        run: |
          k6 run phase-2/backend/tests/load/chat_load_test.js
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: results/
```

---

## Monitoring & Observability

### Real-time Monitoring

```bash
# Run k6 with extended output
k6 run --out json=results.json tests/load/chat_load_test.js
```

### Generate Reports

```bash
# Convert k6 results to HTML report
# Requires: npm install -g xk6-html-reporter

xk6-html-reporter -i results.json -o report.html
```

### Cloud Integration (Grafana Cloud)

```bash
# Run tests and stream to Grafana Cloud
k6 run -o cloud tests/load/chat_load_test.js
```

---

## Common Issues & Solutions

### Issue 1: Connection Errors

**Error**: `connection refused` or `ECONNREFUSED`

**Solution**:
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check firewall
netstat -an | grep 8000
```

### Issue 2: Timeout Errors

**Error**: `Request timeout` or `ctx deadline exceeded`

**Solution**:
```bash
# Increase timeout in script
// In chat_load_test.js, add:
timeout: 30000,  // 30 seconds
```

### Issue 3: High Error Rate

**Error**: > 50% request failures

**Solution**:
1. Check backend logs for errors
2. Reduce VUs (virtual users)
3. Increase think time between requests
4. Check database connection pool size

### Issue 4: Memory Issues

**Error**: `out of memory` or process killed

**Solution**:
```bash
# Reduce iterations or VUs
k6 run --vus 10 --duration 30s tests/load/chat_load_test.js

# Run on machine with more RAM
# Or split tests into separate runs
```

---

## Performance Benchmarks

### Backend Performance Expectations

| Operation | Latency (P95) | Throughput | Notes |
|-----------|---------------|-----------|-------|
| Sign In | < 500ms | 100+ req/s | Auth is cached |
| Create Conversation | < 1000ms | 50+ req/s | Database write |
| Send Message | < 3000ms | 20+ req/s | Includes OpenAI API call |
| List Conversations | < 500ms | 100+ req/s | Cached, indexed |
| Get Messages | < 1000ms | 50+ req/s | Paginated |

### Scaling Metrics

```
@ 20 VUs:   ~1500ms avg response time (comfortable)
@ 50 VUs:   ~2500ms avg response time (acceptable)
@ 100 VUs:  ~4000ms avg response time (concerning)
@ 200+ VUs: > 5000ms avg (needs scaling)
```

---

## Next Steps

1. **Run Baseline Test**
   ```bash
   k6 run tests/load/chat_load_test.js
   ```

2. **Analyze Results**
   - Review response times
   - Check error rate
   - Identify bottlenecks

3. **Optimize if Needed**
   - Add database indexes
   - Implement caching
   - Optimize slow queries

4. **Run Peak Load Test**
   - Verify system handles expected load
   - Document breaking point

5. **Document Results**
   - Create performance report
   - Archive baseline metrics
   - Track improvements over time

---

## Resources

- **k6 Documentation**: https://k6.io/docs/
- **API Reference**: https://k6.io/docs/javascript-api/
- **Best Practices**: https://k6.io/docs/results-output/
- **Examples**: https://github.com/grafana/k6/tree/master/samples

---

## Summary

- ✅ Load testing script created (`chat_load_test.js`)
- ✅ Multiple test scenarios provided
- ✅ Performance thresholds defined
- ✅ Optimization tips documented
- ✅ Ready for execution

**Status**: Load testing infrastructure ready
**Next**: Run tests and analyze results

