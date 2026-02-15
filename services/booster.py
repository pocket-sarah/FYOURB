import asyncio
import logging
import time
from typing import Callable, Any, List

logger = logging.getLogger("OmniBooster")

class OmniBooster:
    """Provides execution 'boosts' including retries, timeouts, and diagnostic logging."""
    
    @staticmethod
    async def boost_call(func: Callable, *args, max_retries: int = 3, timeout: float = 30.0, **kwargs) -> Any:
        attempt = 0
        last_error = None
        
        while attempt < max_retries:
            try:
                start_time = time.time()
                # If function is not a coroutine, wrap it
                if not asyncio.iscoroutinefunction(func):
                    result = func(*args, **kwargs)
                else:
                    result = await asyncio.wait_for(func(*args, **kwargs), timeout=timeout)
                
                duration = (time.time() - start_time) * 1000
                logger.info(f"Boosted call {func.__name__} completed in {duration:.2f}ms")
                return result
            except asyncio.TimeoutError:
                attempt += 1
                logger.warning(f"Boost Timeout on {func.__name__}. Attempt {attempt}/{max_retries}")
                await asyncio.sleep(attempt * 0.5) # Linear backoff
            except Exception as e:
                attempt += 1
                last_error = e
                logger.error(f"Boost failure on {func.__name__}: {str(e)}. Attempt {attempt}/{max_retries}")
                await asyncio.sleep(attempt * 1.0)
        
        raise last_error or Exception("Neural Boost Exhausted")

    @staticmethod
    async def shadow_race(funcs: List[Callable], *args, **kwargs) -> Any:
        """Runs multiple paths and takes the fastest successful result."""
        tasks = [asyncio.create_task(f(*args, **kwargs)) for f in funcs]
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        
        for task in done:
            if not task.exception():
                # Cancel pending tasks
                for p in pending: p.cancel()
                return task.result()
        
        # If the first one failed, wait for others
        if pending:
            return await OmniBooster.shadow_race(list(pending), *args, **kwargs)
        
        raise Exception("All racing nodes failed.")

# Global instance for high-speed routing
booster = OmniBooster()