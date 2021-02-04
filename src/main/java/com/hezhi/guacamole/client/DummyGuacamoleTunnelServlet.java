package com.hezhi.guacamole.client;/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import org.apache.guacamole.GuacamoleException;
import org.apache.guacamole.net.GuacamoleSocket;
import org.apache.guacamole.net.GuacamoleTunnel;
import org.apache.guacamole.net.InetGuacamoleSocket;
import org.apache.guacamole.net.SimpleGuacamoleTunnel;
import org.apache.guacamole.protocol.ConfiguredGuacamoleSocket;
import org.apache.guacamole.protocol.GuacamoleConfiguration;
import org.apache.guacamole.servlet.GuacamoleHTTPTunnelServlet;
import org.springframework.beans.factory.annotation.Value;

@WebServlet(urlPatterns = "/tunnel")
public class DummyGuacamoleTunnelServlet extends GuacamoleHTTPTunnelServlet {

    @Value("${guacamole.server}")
    String guacdHost; //guacamole server address

    int guacdPort = 4822; //guacamole server port

    @Override
    protected GuacamoleTunnel doConnect(HttpServletRequest request) throws GuacamoleException {



        GuacamoleConfiguration configuration = new GuacamoleConfiguration();

        configuration.setProtocol(request.getHeader("protocol")); // 远程连接协议
        configuration.setParameter("hostname", request.getHeader("hostname"));
        configuration.setParameter("port", request.getHeader("port"));
        configuration.setParameter("username", request.getHeader("username"));
        configuration.setParameter("password", request.getHeader("password"));
        configuration.setParameter("ignore-cert", request.getHeader("ignoreCert"));

        // Connect to guacd, proxying a connection to the VNC server above
        GuacamoleSocket socket = new ConfiguredGuacamoleSocket(
                new InetGuacamoleSocket(guacdHost, guacdPort),
                configuration
        );

        // Create tunnel from now-configured socket
        GuacamoleTunnel tunnel = new SimpleGuacamoleTunnel(socket);
        return tunnel;

    }

}
