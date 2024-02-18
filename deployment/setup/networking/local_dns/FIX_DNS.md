# How to configure DNSMASQ & SYSTEMD-RESOLVED services running together on Ubuntu

Basically, first, stop systemd-resolved.service; edit /etc/systemd/resolved.conf 
with the following content: 
> DNSStubListener=127.0.0.2:5353
Then restart "systemd-resolved" service again.


For more details, see below:

```bash
$ sudo lsof -i :53
$ sudo systemctl stop systemd-resolved.service
# Remember DO NOT directly modify configuration files without backup
# Edit "/etc/systemd/resolved.conf" file
# Edit "/etc/dnsmasq.conf" file
$ sudo systemctl restart systemd-resolved
```
Please refer to [resolved.conf](./resolved.conf) for example.


# How to configure APACHE2 on Ubuntu server to forward requests from default port 80,8080 to K8S's service NodePort 30000

In Apache, you can forward requests using various techniques, and one common method is to use the mod_proxy module along with the ProxyPass directive. This allows you to forward requests from one URL to another, either on the same server or a different one. Here are the basic steps:

1. Enable mod_proxy:
Make sure the mod_proxy module is enabled. You can do this by running:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

2. Configure ProxyPass:
Edit your Apache configuration file. This might be /etc/apache2/apache2.conf, /etc/apache2/sites-available/000-default.conf, or a dedicated configuration file.
```bash
sudo nano /etc/apache2/apache2.conf

```
Inside the <VirtualHost> section for your domain, add a ProxyPass directive to forward requests. For example, to forward requests from /app to http://backend-server:8080/:
```sh
<VirtualHost *:80>
    ServerName yourdomain.com

    # ... Other configuration ...

    ProxyPass /app http://backend-server:8080/
    ProxyPassReverse /app http://backend-server:8080/
</VirtualHost>

```
Replace yourdomain.com with your actual domain, /app with the URL path you want to forward, and http://backend-server:8080/ with the target server and URL.

3. Restart Apache:
After making changes, restart Apache:

```sh
sudo systemctl restart apache2

```
4. Testing:
Now, when users access http://yourdomain.com/app, Apache will forward the request to http://backend-server:8080/. Make sure that the target server is configured to handle requests from your Apache server.

Adjust the configuration based on your specific requirements and server setup. Additionally, consider using HTTPS if you're forwarding requests over the internet for security reasons.

Please see [000-default.conf](./000-default.conf) for example