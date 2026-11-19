import logging
import os
from datetime import datetime

class DailyFileHandler(logging.FileHandler):
    def __init__(self, directory, filename_pattern, mode='a', encoding=None, delay=False):
        self.directory = directory
        self.filename_pattern = filename_pattern
        self.mode = mode
        self.encoding = encoding
        self.delay = delay
        self.today = datetime.now().strftime("%Y-%m-%d")
        filename = self.generate_filename()
        os.makedirs(self.directory, exist_ok=True)
        super().__init__(filename, mode, encoding, delay)

    def generate_filename(self):
        return os.path.join(self.directory, self.filename_pattern.format(current_day=self.today))

    def emit(self, record):
        new_today = datetime.now().strftime("%Y-%m-%d")
        if new_today != self.today:
            self.today = new_today
            self.baseFilename = self.generate_filename()
            self.stream = self._open()
        super().emit(record)

def setup_logger():
    logger = logging.getLogger('user_endpoint_logger')
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        stream_handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

        log_directory = os.environ.get('LOG_DIRECTORY', '/app/logs')
        log_filename_pattern = "User_EndPoint_{current_day}.log"
        try:
            file_handler = DailyFileHandler(
                directory=log_directory,
                filename_pattern=log_filename_pattern,
            )
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except OSError:
            logger.warning('File logging unavailable; using container logs only')
    return logger
